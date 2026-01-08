const express = require('express');
const app = express();
const PORT = 5001;

app.get('/', (req, res) => {
  res.send('Hello from test server!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
