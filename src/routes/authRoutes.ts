import express from 'express';
import { storeApiToken } from '../controllers/auth.controller';
const router = express.Router();

router.post('/token', storeApiToken);

export default router;
