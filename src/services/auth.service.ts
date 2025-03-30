import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import config from '../config';
import { User } from '../types';
import { WealthboxService } from './wealthbox.service';

export const AuthService = {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  generateToken(userId: number): string {
    return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '24h' });
  },

  async register(userData: User & {wealthboxApiToken:string}) {
    const { email, password, firstName, lastName, wealthboxApiToken } = userData;
    
    console.log(`Attempting to register user with email: ${email}`);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.error(`Registration failed: Email ${email} already in use`);
      throw new Error('Email already in use');
    }

    // Handle Wealthbox token verification if provided
    let isWealthboxAuthenticated = false;
    if (wealthboxApiToken) {
      isWealthboxAuthenticated = await WealthboxService.authenticateWithToken(wealthboxApiToken);
      if (!isWealthboxAuthenticated) {
        throw new Error('Invalid Wealthbox API token');
      }
    }

    const hashedPassword = password ? await this.hashPassword(password) : null;

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        wealthboxApiToken,
        isWealthboxAuthenticated,
        isAdmin: false
      }
    });

    console.log(`User registered successfully with email: ${email}`);
    return newUser;
  },

  async login(email: string, password: string, wealthboxApiToken?: string) {
    console.log(`Login attempt for email: ${email}`);
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Handle Wealthbox token authentication
    if (wealthboxApiToken) {
      const isValid = await WealthboxService.authenticateWithToken(wealthboxApiToken);
      if (!isValid) {
        throw new Error('Invalid Wealthbox API token');
      }
      
      // Update user with new token if different
      if (user.wealthboxApiToken !== wealthboxApiToken) {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            wealthboxApiToken,
            isWealthboxAuthenticated: true
          }
        });
      }
      
      // Skip password check for Wealthbox token auth
      const token = this.generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token
      };
    }

    // Regular password authentication
    if (!user.password) {
      throw new Error('Password not set for this user');
    }

    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  },

  async updateWealthboxToken(userId: number, token: string) {
    const isValid = await WealthboxService.authenticateWithToken(token);
    if (!isValid) {
      throw new Error('Invalid Wealthbox API token');
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        wealthboxApiToken: token,
        isWealthboxAuthenticated: true
      }
    });
  }
};