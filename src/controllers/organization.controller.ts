import { Request, Response } from 'express';
import { OrganizationService } from '../services/oraganization.service';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const OrganizationController = {
  async createOrganization(req: Request, res: Response) {
    try {
      const { name } = req.body;
      
      if (!name) {
        return errorResponse(res, 'Organization name is required', 400);
      }
      
      const organization = await OrganizationService.create({ name });
      successResponse(res, organization, 'Organization created successfully');
    } catch (error) {
      errorResponse(res, 'Failed to create organization', 500, error);
    }
  },

  async getAllOrganizations(req: Request, res: Response) {
    try {
      const organizations = await OrganizationService.findAll();
      successResponse(res, organizations);
    } catch (error) {
      errorResponse(res, 'Failed to fetch organizations', 500, error);
    }
  },

  async getOrganizationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const organization = await OrganizationService.findById(id);
      
      if (!organization) {
        return errorResponse(res, 'Organization not found', 404);
      }
      
      successResponse(res, organization);
    } catch (error) {
      errorResponse(res, 'Failed to fetch organization', 500, error);
    }
  },

  async updateOrganization(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      
      if (!name) {
        return errorResponse(res, 'Organization name is required', 400);
      }
      
      const organization = await OrganizationService.update(id, { name });
      successResponse(res, organization, 'Organization updated successfully');
    } catch (error) {
      errorResponse(res, 'Failed to update organization', 500, error);
    }
  },

  async deleteOrganization(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await OrganizationService.delete(id);
      successResponse(res, null, 'Organization deleted successfully');
    } catch (error) {
      errorResponse(res, 'Failed to delete organization', 500, error);
    }
  }
};