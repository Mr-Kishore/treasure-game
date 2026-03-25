console.log('Starting server...');

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Server is working!' }));
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
});
