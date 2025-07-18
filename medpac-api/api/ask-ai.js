// File: api/ask-ai.js

const MEDPAC_SYSTEM_PROMPT = `You are the AI assistant for MedPAC...`; // Paste your full prompt here from the previous answer

export default async function handler(request, response) {
  // Allow requests from your GitHub Pages domain
  response.setHeader('Access-Control-Allow-Origin', 'https://your-username.github.io');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight CORS requests
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { message, language, history } = request.body;

  if (!message || !language) {
    return response.status(400).json({ error: 'Message and language are required.' });
  }

  const messages = [
      { role: 'system', content: MEDPAC_SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message },
      { role: 'system', content: `Please provide the response in ${language === 'fa' ? 'Farsi' : 'English'}.` }
  ];

  try {
    const metisResponse = await fetch('https://api.metisai.ir/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The key is read securely from environment variables
        'Authorization': `Bearer ${process.env.METISAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4", // Or any other model supported by MetisAI
        messages: messages,
      })
    });

    if (!metisResponse.ok) {
      throw new Error(`MetisAI API error: ${metisResponse.statusText}`);
    }

    const data = await metisResponse.json();
    const reply = data.choices[0].message.content;

    return response.status(200).json({ reply });

  } catch (error) {
    console.error('Error calling MetisAI API:', error);
    return response.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
}