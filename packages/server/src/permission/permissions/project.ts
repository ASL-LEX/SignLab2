import { Roles } from './roles';

/** Permissions associated with projects */
export enum ProjectPermissions {
  CREATE = 'project:create',
  READ = 'project:read',
  UPDATE = 'project:update',
  DELETE = 'project:delete'
}

/** All role to project permissions */
export const roleToProjectPermissions: string[][] = [
  // OWNER permissions
  [Roles.OWNER, ProjectPermissions.CREATE],
  [Roles.OWNER, ProjectPermissions.DELETE],

  // PROJECT_ADMIN permissions
  [Roles.PROJECT_ADMIN, ProjectPermissions.UPDATE],

  // STUDY_ADMIN permissions

  // CONTRIBUTOR permissions
  [Roles.CONTRIBUTOR, ProjectPermissions.READ]
];
