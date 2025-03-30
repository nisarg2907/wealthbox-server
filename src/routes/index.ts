import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './auth.route';
import organizationRoutes from './organization.route';
import integrationRoutes from './integration.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/integrations', integrationRoutes);

export default router;
