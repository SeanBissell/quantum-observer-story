// Simple Node.js proxy server to hide MiniMax API key
// This keeps the API key server-side and away from the browser

const http = require('http');
const https = require('https');

// ===== CONFIGURATION =====
const PORT = 3001;
const MINIMAX_API_KEY = 'sk-cp-KSRWAbM2S710sls8ZxTWTkbkDj5_ayazeyWbQJR2pRBPJIn-XvslOkraEtCbHprcPAyUX7uP4DJmx3pw31EC2KPuX36gysUyix89jrmlTBrNUG4hNv8YZ2Q'; // Replace with your actual API key
const MINIMAX_ENDPOINT = 'api.minimax.io';

// ===== CREATE SERVER =====
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Only accept POST to /api/chat
    if (req.method !== 'POST' || req.url !== '/api/chat') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
    }

    // Collect request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const requestData = JSON.parse(body);

            // Prepare request to MiniMax
            const options = {
                hostname: MINIMAX_ENDPOINT,
                path: '/anthropic/v1/messages',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${MINIMAX_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            };

            // Forward request to MiniMax
            const proxyReq = https.request(options, (proxyRes) => {
                // Forward status and headers
                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': proxyRes.headers['content-type'],
                    'Access-Control-Allow-Origin': '*'
                });

                // Stream response back to client
                proxyRes.pipe(res);
            });

            proxyReq.on('error', (error) => {
                console.error('Proxy error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Proxy error' }));
            });

            // Send the request
            proxyReq.write(JSON.stringify(requestData));
            proxyReq.end();

        } catch (error) {
            console.error('Error parsing request:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🔒 Secure proxy server running on http://localhost:${PORT}`);
    console.log(`📖 Open interactive-story.html in your browser to start the story\n`);
});
