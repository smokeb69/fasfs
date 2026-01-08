console.log('Testing basic Node.js execution...');

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);

  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Basic server working!', timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Basic HTTP server is working!');
  }
});

const PORT = 5002;

server.listen(PORT, () => {
  console.log(`Basic HTTP server listening on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
});

// Keep alive
setTimeout(() => {
  console.log('Server has been running for 10 seconds');
}, 10000);
