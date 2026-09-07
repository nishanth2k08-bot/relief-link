// Vercel Serverless Function: Send OTP via MSG91
// Endpoint: POST /api/auth/send-otp

const axios = require('axios');

// Store OTPs in memory (for production, use Redis or database)
const otpStore = new Map();

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOTPViaMSG91(phoneNumber, otp) {
  try {
    const url = 'https://api.msg91.com/api/sendhttp.php';
    
    const response = await axios.get(url, {
      params: {
        authkey: process.env.MSG91_AUTH_KEY,
        mobiles: phoneNumber,
        message: `Your ReliefLink OTP is ${otp}. Do not share it.`,
        route: process.env.MSG91_ROUTE || '4',
        sender: process.env.MSG91_SENDER_ID || '1234',
        DLT_TE_ID: process.env.MSG91_TEMPLATE_ID
      }
    });

    console.log(`OTP sent to ${phoneNumber}:`, response.data);
    return { success: true, message: response.data };
  } catch (error) {
    console.error('MSG91 Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, countryCode } = req.body;

    // Validation
    if (!phoneNumber || !countryCode) {
      return res.status(400).json({ error: 'Phone number and country code required' });
    }

    // Check API key
    if (!process.env.MSG91_AUTH_KEY) {
      return res.status(500).json({ error: 'MSG91 API key not configured' });
    }

    // Format phone number for MSG91 (remove special chars, add country code)
    const formattedPhone = `${countryCode.replace('+', '')}${phoneNumber.replace(/\D/g, '')}`;

    // Validate phone format
    if (formattedPhone.length < 10 || formattedPhone.length > 15) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Send via MSG91
    const result = await sendOTPViaMSG91(formattedPhone, otp);

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to send OTP', details: result.error });
    }

    // Store OTP with 10-minute expiry
    otpStore.set(formattedPhone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: formattedPhone,
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
