import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/connect-wealthbox', authenticateJWT, AuthController.connectWealthbox);
router.get('/me', AuthController.getCurrentUser);

export default router;