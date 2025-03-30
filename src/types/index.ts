export interface User {
    id?: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    password?: string;
    isAdmin?: boolean;
    organizationId?: number | null;
    wealthboxId?: string | null;
  }
  
  export interface Organization {
    id?: number;
    name: string;
  }
  
  export interface IntegrationConfig {
    id?: number;
    organizationId: number;
    integrationType: string;
    apiToken?: string | null;
    apiUrl?: string | null;
    isActive?: boolean;
  }
  
  export interface AuthToken {
    userId: number;
  }