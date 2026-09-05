module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const { messages, system } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: { message: 'Messages are required' }
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: system || '',
        messages
      })
    });

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Anthropic API error:', error);

    return res.status(500).json({
      error: {
        message: 'حدث خطأ في خادم الذكاء الاصطناعي'
      }
    });
  }
};
