import prisma from '../lib/prisma';
import { User } from '../types';
import { AuthService } from './auth.service';

export const UserService = {
  async findAll(organizationId?: number): Promise<User[]> {
    return prisma.user.findMany({
      where: organizationId ? { organizationId } : undefined,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        organizationId: true,
        wealthboxId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        organizationId: true,
        wealthboxId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async update(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        password: data.password ? await AuthService.hashPassword(data.password) : undefined
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        organizationId: true,
        wealthboxId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  },

  async assignToOrganization(userId: number, organizationId: number): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        organizationId: true,
        wealthboxId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
};