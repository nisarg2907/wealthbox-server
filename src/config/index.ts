import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  WEALTHBOX_API_URL: process.env.WEALTHBOX_API_URL,
  WEALTHBOX_API_TOKEN: process.env.WEALTHBOX_API_TOKEN,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL
};