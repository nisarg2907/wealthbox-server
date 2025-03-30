import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const UserController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const organizationId = req.query.organizationId ? Number(req.query.organizationId) : undefined;
      const users = await UserService.findAll(organizationId);
      successResponse(res, users);
    } catch (error) {
      errorResponse(res, 'Failed to fetch users', 500, error);
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = await UserService.findById(id);
      
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }
      
      successResponse(res, user);
    } catch (error) {
      errorResponse(res, 'Failed to fetch user', 500, error);
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      const user = await UserService.update(id, data);
      successResponse(res, user, 'User updated successfully');
    } catch (error) {
      errorResponse(res, 'Failed to update user', 500, error);
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await UserService.delete(id);
      successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      errorResponse(res, 'Failed to delete user', 500, error);
    }
  },

  async assignUserToOrganization(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const { organizationId } = req.body;
      
      if (!organizationId) {
        return errorResponse(res, 'Organization ID is required', 400);
      }
      
      const user = await UserService.assignToOrganization(userId, organizationId);
      successResponse(res, user, 'User assigned to organization successfully');
    } catch (error) {
      errorResponse(res, 'Failed to assign user', 500, error);
    }
  }
};