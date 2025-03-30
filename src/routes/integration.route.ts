import express from 'express';
import { IntegrationController } from '../controllers/integration.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/wealthbox/sync', authenticateJWT, isAdmin, IntegrationController.syncWealthboxUsers);
router.post('/config', authenticateJWT, isAdmin, IntegrationController.configureIntegration);
router.get('/config/:organizationId', authenticateJWT, IntegrationController.getIntegrationConfig);
router.put('/config/:id', authenticateJWT, isAdmin, IntegrationController.updateIntegrationConfig);

export default router;