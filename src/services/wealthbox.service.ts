import axios from 'axios';
import prisma from '../lib/prisma';
import config from '../config';

export const WealthboxService = {
  async authenticateWithToken(token: string): Promise<boolean> {
    try {
      await axios.get(`${config.WEALTHBOX_API_URL}/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          limit: 1
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async getAllUsers(token?: string): Promise<any[]> {
    try {
      const response = await axios.get(`${config.WEALTHBOX_API_URL}/contacts`, {
        headers: {
          'Authorization': `Bearer ${token || config.WEALTHBOX_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.contacts;
    } catch (error) {
      console.error('Error fetching users from Wealthbox:', error);
      throw error;
    }
  },

  async syncUsersToDatabase(organizationId: number): Promise<{ created: number; updated: number }> {
    const wealthboxUsers = await this.getAllUsers();
    let created = 0;
    let updated = 0;

    for (const wbUser of wealthboxUsers) {
      const userData = {
        wealthboxId: wbUser.id.toString(),
        email: wbUser.email,
        firstName: wbUser.first_name,
        lastName: wbUser.last_name,
        organizationId: organizationId
      };

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { wealthboxId: wbUser.id.toString() },
            { email: wbUser.email }
          ]
        }
      });

      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: userData
        });
        updated++;
      } else {
        await prisma.user.create({
          data: userData
        });
        created++;
      }
    }

    return { created, updated };
  }
};