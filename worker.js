// Cloudflare Worker - Secure proxy for MiniMax API
// Deploy this to Cloudflare Workers at: quantum-observer-api.seanbissell.workers.dev

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only accept POST to /api/chat
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/api/chat') {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Get request body
      const requestData = await request.json();

      // Forward to MiniMax API
      const response = await fetch('https://api.minimax.io/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.MINIMAX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Return response with CORS headers
      const newResponse = new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type'),
          'Access-Control-Allow-Origin': '*',
        },
      });

      return newResponse;

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Proxy error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
