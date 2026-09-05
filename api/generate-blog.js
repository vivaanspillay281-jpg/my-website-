module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on Vercel.' });

  try {
    const { topic, audience, tone, length, notes } = req.body || {};
    if (!topic || typeof topic !== 'string') return res.status(400).json({ error: 'Please provide a topic.' });

    const prompt = `Write a high-quality blog post about: ${topic}\nAudience: ${audience || 'general readers'}\nTone: ${tone || 'clear and conversational'}\nLength: ${length || 'Medium'}\nExtra instructions: ${notes || 'None'}\n\nReturn ONLY valid JSON with exactly two string fields: title and content. The content should be Markdown with a strong introduction, useful headings, practical examples where relevant, and a concise conclusion. Do not include code fences around the JSON.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'gpt-4.1-mini', temperature: 0.7, messages: [
        { role: 'system', content: 'You are an expert blog writer. Be accurate, original, useful, and readable.' },
        { role: 'user', content: prompt }
      ] })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'AI provider request failed.' });

    let parsed;
    try { parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}'); }
    catch { return res.status(502).json({ error: 'The AI returned an invalid response. Please try again.' }); }

    if (!parsed.title || !parsed.content) return res.status(502).json({ error: 'The AI response was incomplete. Please try again.' });
    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to generate the article right now.' });
  }
};
