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

    const openRouterMessages = [];

    if (system) {
      openRouterMessages.push({
        role: 'system',
        content: system
      });
    }

    openRouterMessages.push(...messages);

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://design-flow-ai-eta.vercel.app',
          'X-Title': 'DesignFlow AI'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b:free',
          messages: openRouterMessages,
          max_tokens: 1024
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: {
          message:
            data?.error?.message ||
            'حدث خطأ في خدمة الذكاء الاصطناعي'
        }
      });
    }

    return res.status(200).json({
      content: data.choices?.[0]?.message?.content || ''
    });

  } catch (error) {
    console.error('OpenRouter API error:', error);

    return res.status(500).json({
      error: {
        message: 'حدث خطأ في خادم الذكاء الاصطناعي'
      }
    });
  }
};
