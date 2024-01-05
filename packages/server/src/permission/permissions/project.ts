import { Roles } from './roles';

/** Permissions associated with projects */
export enum ProjectPermissions {
  CREATE = 'project:create',
  READ = 'project:read',
  UPDATE = 'project:update',
  DELETE = 'project:delete',
  GRANT_ADMIN = 'project:grant_admin',
}

/** All role to project permissions */
export const roleToProjectPermissions: string[][] = [
  // OWNER permissions
  [Roles.OWNER, ProjectPermissions.CREATE],
  [Roles.OWNER, ProjectPermissions.DELETE],
  [Roles.OWNER, ProjectPermissions.GRANT_ADMIN],

  // PROJECT_ADMIN permissions
  [Roles.PROJECT_ADMIN, ProjectPermissions.UPDATE],

  // STUDY_ADMIN permissions

  // CONTRIBUTOR permissions
  [Roles.CONTRIBUTOR, ProjectPermissions.READ]
];
