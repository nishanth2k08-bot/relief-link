// Vercel Serverless Function: Verify OTP
// Endpoint: POST /api/auth/verify-otp

// Store OTPs in memory (same as send-otp.js)
const otpStore = new Map();

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
    const { phoneNumber, countryCode, otp } = req.body;

    // Validation
    if (!phoneNumber || !countryCode || !otp) {
      return res.status(400).json({ error: 'Phone number, country code, and OTP required' });
    }

    // Format phone number (same as send-otp)
    const formattedPhone = `${countryCode.replace('+', '')}${phoneNumber.replace(/\D/g, '')}`;

    // For demo/testing: accept any 6-digit code or hardcoded test code
    // In production with database, verify against stored OTP
    
    // Simulate checking against stored OTP
    // Note: In production with Vercel, use Redis or serverless DB like MongoDB
    const testOTP = '123456'; // For testing only - remove in production
    
    if (otp === testOTP || /^\d{6}$/.test(otp)) {
      // OTP verified successfully
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        phoneNumber: formattedPhone,
        token: `relieflink_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    } else {
      return res.status(400).json({
        error: 'Invalid OTP',
        attemptsRemaining: 2
      });
    }

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
