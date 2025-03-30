import { Router } from 'express';
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
} from '../controllers/organizations.controller';
import { withWealthboxClient } from '../middleware/withWeathboxClient';

const router = Router();

router.get('/', withWealthboxClient, getOrganizations);
// @ts-ignore
router.post('/', withWealthboxClient, createOrganization);
// @ts-ignore
router.put('/:externalId', withWealthboxClient, updateOrganization);

export default router;
