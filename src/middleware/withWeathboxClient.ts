// middleware/withWealthboxClient.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY!;

export const withWealthboxClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orgId = Number(req.headers['x-org-id']);
    if (!orgId) {
      res.status(400).json({ error: 'Missing org ID' });
      return;
    }

    const config = await prisma.integrationConfig.findFirst({
      where: { organizationId: orgId },
    });

    if (!config) {
      res.status(404).json({ error: 'Integration not found' });
      return;
    }

    const decrypted = CryptoJS.AES.decrypt(config.apiToken, SECRET_KEY);
    const token = decrypted.toString(CryptoJS.enc.Utf8);

    (req as any).wealthboxClient = axios.create({
      baseURL: 'https://api.crmworkspace.com/v1',
      headers: { ACCESS_TOKEN: token },
    });

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Wealthbox client' });
  }
};
