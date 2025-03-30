import { Request, Response } from 'express';
import { WealthboxService } from '../services/wealthbox.service';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { IntegrationService } from '../services/integration.service';

export const IntegrationController = {
  async syncWealthboxUsers(req: Request, res: Response) {
    try {
      const { organizationId } = req.body;
      
      if (!organizationId) {
        return errorResponse(res, 'Organization ID is required', 400);
      }

      const result = await WealthboxService.syncUsersToDatabase(organizationId);
      successResponse(res, result, 'Sync completed successfully');
    } catch (error) {
      errorResponse(res, 'Failed to sync users', 500, error);
    }
  },

  async configureIntegration(req: Request, res: Response) {
    try {
      const { organizationId, integrationType, apiToken, apiUrl } = req.body;
      
      if (!organizationId || !integrationType) {
        return errorResponse(res, 'Organization ID and integration type are required', 400);
      }

      // Verify the API token if it's Wealthbox
      if (integrationType === 'wealthbox' && apiToken) {
        const isValid = await WealthboxService.authenticateWithToken(apiToken);
        if (!isValid) {
          return errorResponse(res, 'Invalid Wealthbox API token', 400);
        }
      }

      const config = await IntegrationService.createConfig({
        organizationId,
        integrationType,
        apiToken,
        apiUrl
      });
      
      successResponse(res, config, 'Integration configured successfully');
    } catch (error) {
      errorResponse(res, 'Failed to configure integration', 500, error);
    }
  },

  async getIntegrationConfig(req: Request, res: Response) {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const config = await IntegrationService.getConfig(organizationId);
      
      if (!config) {
        return errorResponse(res, 'Integration config not found', 404);
      }
      
      successResponse(res, config);
    } catch (error) {
      errorResponse(res, 'Failed to get integration config', 500, error);
    }
  },

  async updateIntegrationConfig(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      
      if (data.apiToken) {
        const isValid = await WealthboxService.authenticateWithToken(data.apiToken);
        if (!isValid) {
          return errorResponse(res, 'Invalid Wealthbox API token', 400);
        }
      }
      
      const config = await IntegrationService.updateConfig(id, data);
      successResponse(res, config, 'Integration updated successfully');
    } catch (error) {
      errorResponse(res, 'Failed to update integration', 500, error);
    }
  }
};