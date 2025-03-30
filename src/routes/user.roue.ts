import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateJWT, UserController.getAllUsers);
router.get('/:id', authenticateJWT, UserController.getUserById);
router.put('/:id', authenticateJWT, UserController.updateUser);
router.delete('/:id', authenticateJWT, UserController.deleteUser);
router.put('/:id/organization', authenticateJWT, UserController.assignUserToOrganization);

export default router;