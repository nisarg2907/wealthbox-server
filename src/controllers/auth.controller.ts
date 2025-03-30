import axios from 'axios';
import CryptoJS from 'crypto-js';
import prisma from '../lib/prisma';
import { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('ENCRYPT_SECRET is missing from environment variables.');
}


export const storeApiToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  console.log('Received request to store API token');

  try {
    console.log('Fetching user details from Wealthbox API');
    const meRes = await axios.get('https://api.crmworkspace.com/v1/me', {
      headers: { 'ACCESS_TOKEN': token },
    });

    console.log('User details fetched successfully');
    const { current_user, accounts } = meRes.data;
    const wealthboxUserId = current_user.id;
    const email = current_user.email;
    const name = current_user.name;
    const accountId = accounts[0].id;
    const accountName = accounts[0].name;

    console.log(`Upserting organization with externalId: ${accountId}`);
    const organization = await prisma.organization.upsert({
      where: { externalId: accountId },
      update: { name: accountName },
      create: { name: accountName, externalId: accountId },
    });

    console.log(`Upserting user with email: ${email}`);
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        wealthboxUserId,
        organizationId: organization.id,
      },
    });

    console.log('Encrypting API token');
    const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();

    console.log(`Upserting integration config for organizationId: ${organization.id}`);
    await prisma.integrationConfig.upsert({
      where: { organizationId: organization.id },
      update: { apiToken: encryptedToken },
      create: {
        organizationId: organization.id,
        apiToken: encryptedToken,
      },
    });

    console.log('API token stored successfully');
    res.status(200).json({
      success: true,
      organizationId: organization.id,
    });
  } catch (err) {
    console.error('Failed to store token:', err);
    res.status(500).json({ error: 'Failed to store token' });
  }
};
