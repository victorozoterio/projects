import { CreateUsersTable1746919033213 } from '@url-shortener/backend/auth-backend/src/migrations/1746919033213-create-users-table';
import { CreateTokensTable1747061357363 } from '@url-shortener/backend/auth-backend/src/migrations/1747061357363-create-tokens-table';
import { CreateCampaignsTable1751402554284 } from '@url-shortener/backend/management-backend/src/migrations/1751402554284-create-campaigns-table';
import { CreateUrlsTable1751668669507 } from '@url-shortener/backend/management-backend/src/migrations/1751668669507-create-urls-table';

export const migrations = [
  CreateUsersTable1746919033213,
  CreateTokensTable1747061357363,
  CreateCampaignsTable1751402554284,
  CreateUrlsTable1751668669507,
];
