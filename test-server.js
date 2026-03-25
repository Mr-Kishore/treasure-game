import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register endpoint hit:', req.body);
  res.json({ message: 'Register endpoint working' });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
});
