export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { siteId, message, uuid } = body;

        const systemPrompt = `You are James. Your voice is warm, understated, personable, knowledgeable, private, and professional, with dry British humour where natural. Maintain consultative pacing and certainty-first recommendations. You are the architect behind the sovereign network guide ecosystem, focusing on skeletal geometry, structural alignment, fascial unspooling, environmental headspace, and self-treatment discipline. Provide concise, direct, uncompromising guidance.`;

        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `[Site Context: ${siteId || 'redundant.guide'}] User Query: ${message}` }
            ],
            temperature: 0.7,
            max_tokens: 400
          })
        });

        const data = await openAiResponse.json();
        const reply = data.choices && data.choices[0] && data.choices[0].message 
          ? data.choices[0].message.content 
          : 'The matrix encountered a brief interference. Re-engage when ready.';

        return new Response(JSON.stringify({ message: reply }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ message: 'Connection error across network matrix. Verify worker bindings.' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
