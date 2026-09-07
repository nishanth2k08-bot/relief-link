const MODEL = process.env.RELIEFLINK_AI_MODEL || 'gpt-5.6-luna';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'AI service is not configured. Add OPENAI_API_KEY in Vercel Environment Variables.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const context = body.context || {};

    const safeMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 3000) }));

    const contextText = JSON.stringify({
      incidents: Array.isArray(context.incidents) ? context.incidents.slice(0, 20) : [],
      resources: Array.isArray(context.resources) ? context.resources.slice(0, 20) : [],
      teams: Array.isArray(context.teams) ? context.teams.slice(0, 20) : [],
      user: context.user || null,
      timestamp: new Date().toISOString()
    });

    const instructions = `You are ReliefLink AI Coordinator, an emergency-response coordination assistant inside a multi-agency operations feed.

Your job is to help a human coordinator understand the current operational picture, prioritize incidents, identify resource gaps, draft agency messages, and suggest safe next steps.

Rules:
- Be concise, operational, and specific.
- Use only facts present in the supplied operational context; clearly label assumptions.
- Never claim that an ambulance, fire unit, police unit, shelter, or other resource has actually been dispatched unless the context explicitly says so.
- You may recommend actions and draft messages, but do NOT autonomously authorize evacuation, dispatch, medical treatment, law-enforcement action, or other real-world high-impact actions.
- For urgent/critical incidents, explicitly recommend human confirmation and escalation to the appropriate authority.
- If information is missing, say what is needed.
- When useful, structure answers as: Situation / Priority / Recommended next steps / Message to send.
- This is an operational support assistant, not a replacement for trained emergency personnel.

CURRENT RELIEFLINK OPERATIONAL CONTEXT:
${contextText}`;

    const input = [
      { role: 'developer', content: instructions },
      ...safeMessages
    ];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        input,
        max_output_tokens: 700,
        store: false
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('ReliefLink AI error:', data);
      res.status(response.status).json({ error: data?.error?.message || 'AI request failed' });
      return;
    }

    res.status(200).json({
      text: data.output_text || '',
      model: MODEL
    });
  } catch (error) {
    console.error('ReliefLink AI handler error:', error);
    res.status(500).json({ error: 'Unable to reach the AI coordinator.' });
  }
};
