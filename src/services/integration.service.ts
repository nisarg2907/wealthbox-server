import prisma from '../lib/prisma';
import { IntegrationConfig } from '../types';

export const IntegrationService = {
  async createConfig(data: IntegrationConfig): Promise<IntegrationConfig> {
    return prisma.integrationConfig.create({ data });
  },

  async getConfig(organizationId: number): Promise<IntegrationConfig | null> {
    return prisma.integrationConfig.findFirst({
      where: { organizationId }
    });
  },

  async updateConfig(id: number, data: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    return prisma.integrationConfig.update({
      where: { id },
      data
    });
  },

  async activateIntegration(id: number): Promise<IntegrationConfig> {
    return this.updateConfig(id, { isActive: true });
  },

  async deactivateIntegration(id: number): Promise<IntegrationConfig> {
    return this.updateConfig(id, { isActive: false });
  }
};