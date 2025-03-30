import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getOrganizations = async (req: Request, res: Response) => {
  const client = (req as any).wealthboxClient;

  try {
    const { data } = await client.get('/accounts');

    for (const account of data.accounts) {
      await prisma.organization.upsert({
        where: { externalId: account.id },
        update: { name: account.name },
        create: {
          name: account.name,
          externalId: account.id,
        },
      });
    }

    const orgs = await prisma.organization.findMany();
    res.json(orgs);
  } catch (error) {
    console.error('Error fetching orgs:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};
export const createOrganization = async (req: Request, res: Response) => {
    const { name } = req.body;
    const client = (req as any).wealthboxClient;
  
    if (!name) {
      return res.status(400).json({ error: 'Organization name is required' });
    }
  
    try {
      const { data } = await client.post('/accounts', { name });
  
      const org = await prisma.organization.create({
        data: {
          name: data.name,
          externalId: data.id,
        },
      });
  
       res.status(201).json(org);
    } catch (error) {
      console.error('Error creating org:', error);
      res.status(500).json({ error: 'Failed to create organization' });
    }
  };
  export const updateOrganization = async (req: Request, res: Response) => {
    const externalId = Number(req.params.externalId);
    const { name } = req.body;
    const client = (req as any).wealthboxClient;
  
    if (!name || !externalId) {
      return res.status(400).json({ error: 'Name and externalId are required' });
    }
  
    try {
      await client.put(`/accounts/${externalId}`, { name });
  
      const updated = await prisma.organization.update({
        where: { externalId },
        data: { name },
      });
  
      res.json(updated);
    } catch (error) {
      console.error('Error updating org:', error);
      res.status(500).json({ error: 'Failed to update organization' });
    }
  };
  