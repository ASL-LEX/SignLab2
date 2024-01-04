import { Roles } from './roles';

export enum TagPermissions {
  CREATE = 'tag:create',
  READ = 'tag:read',
  UPDATE = 'tag:update',
  DELETE = 'tag:delete'
}

export const roleToTagPermissions: string[][] = [
  // OWNER permissions

  // PROJECT_ADMIN permissions

  // STUDY_ADMIN permissions
  [Roles.STUDY_ADMIN, TagPermissions.READ],
  [Roles.STUDY_ADMIN, TagPermissions.DELETE],
  [Roles.STUDY_ADMIN, TagPermissions.UPDATE],

  // CONTRIBUTOR permissions
  [Roles.CONTRIBUTOR, TagPermissions.CREATE]
];
