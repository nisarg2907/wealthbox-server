import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, wealthboxApiToken } = req.body;
      
      const user = await AuthService.register({ 
        email, 
        password, 
        firstName, 
        lastName,
        wealthboxApiToken 
      });
      
      const token = AuthService.generateToken(user.id);
      
      successResponse(res, { 
        user, 
        token,
        isWealthboxAuthenticated: user.isWealthboxAuthenticated 
      }, 'User registered successfully');
    } catch (error) {
      errorResponse(res, 'Registration failed', 400, error);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password, wealthboxApiToken } = req.body;
      
      if ((!email || !password) && !wealthboxApiToken) {
        return errorResponse(res, 'Either email/password or Wealthbox token is required', 400);
      }

      const { user, token } = await AuthService.login(
        email, 
        password, 
        wealthboxApiToken
      );
      
      successResponse(res, { 
        user, 
        token,
        isWealthboxAuthenticated: user.isWealthboxAuthenticated  ?? false
      }, 'Login successful');
    } catch (error) {
      errorResponse(res, 'Login failed', 401, error);
    }
  },

  async connectWealthbox(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { apiToken } = req.body;
      
      if (!apiToken) {
        return errorResponse(res, 'Wealthbox API token is required', 400);
      }

      const user = await AuthService.updateWealthboxToken(userId, apiToken);
      successResponse(res, user, 'Wealthbox connected successfully');
    } catch (error) {
      errorResponse(res, 'Failed to connect Wealthbox', 400, error);
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      successResponse(res, user);
    } catch (error) {
      errorResponse(res, 'Failed to get current user', 500, error);
    }
  }
};