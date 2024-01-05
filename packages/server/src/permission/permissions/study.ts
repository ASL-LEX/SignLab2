import { Roles } from './roles';

/** Permissions associated with studies */
export enum StudyPermissions {
  CREATE = 'study:create',
  READ = 'study:read',
  UPDATE = 'study:update',
  DELETE = 'study:delete',
  GRANT_ACCESS = 'study:grant_access'
}

/** All role to study permissions */
export const roleToStudyPermissions: string[][] = [
  // OWNER permissions

  // PROJECT_ADMIN permissions
  [Roles.PROJECT_ADMIN, StudyPermissions.CREATE],
  [Roles.PROJECT_ADMIN, StudyPermissions.DELETE],

  // STUDY_ADMIN permissions
  [Roles.STUDY_ADMIN, StudyPermissions.UPDATE],
  [Roles.STUDY_ADMIN, StudyPermissions.GRANT_ACCESS],

  // CONTRIBUTOR permissions
  [Roles.CONTRIBUTOR, StudyPermissions.READ]

  // TRAINED_CONTRIBUTOR permissions
];
