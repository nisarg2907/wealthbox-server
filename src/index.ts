import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});