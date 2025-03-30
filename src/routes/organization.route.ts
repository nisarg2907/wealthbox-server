import express from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateJWT, isAdmin, OrganizationController.createOrganization);
router.get('/', authenticateJWT, OrganizationController.getAllOrganizations);
router.get('/:id', authenticateJWT, OrganizationController.getOrganizationById);
router.put('/:id', authenticateJWT, isAdmin, OrganizationController.updateOrganization);
router.delete('/:id', authenticateJWT, isAdmin, OrganizationController.deleteOrganization);

export default router;