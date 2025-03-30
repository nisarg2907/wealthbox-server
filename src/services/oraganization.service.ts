import prisma from '../lib/prisma';
import { Organization } from '../types';

export const OrganizationService = {
  async create(data: Organization): Promise<Organization> {
    return prisma.organization.create({ data });
  },

  async findAll(): Promise<Organization[]> {
    return prisma.organization.findMany();
  },

  async findById(id: number): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        users: true,
        integrations: true
      }
    });
  },

  async update(id: number, data: Partial<Organization>): Promise<Organization> {
    return prisma.organization.update({
      where: { id },
      data
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.organization.delete({ where: { id } });
  }
};