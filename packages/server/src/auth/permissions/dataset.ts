import { Roles } from '../roles';

export enum DatasetPermissions {
  CREATE = 'dataset:create',
  READ = 'dataset:read',
  UPDATE = 'dataset:update',
  DELETE = 'dataset:delete',
  GRANT_ACCESS = 'dataset:grant_access'
}

/** All role to dataset permissions */
export const roleToDatasetPermissions: string[][] = [
  // OWNER permissions
  [Roles.OWNER, DatasetPermissions.CREATE],
  [Roles.OWNER, DatasetPermissions.READ],
  [Roles.OWNER, DatasetPermissions.UPDATE],
  [Roles.OWNER, DatasetPermissions.DELETE],
  [Roles.OWNER, DatasetPermissions.GRANT_ACCESS],

  // PROJECT_ADMIN permissions

  // STUDY_ADMIN permissions

  // CONTRIBUTOR permissions
  [Roles.CONTRIBUTOR, DatasetPermissions.READ]
];
