export enum Roles {
  OWNER = 'owner',
  PROJECT_ADMIN = 'project_admin',
  STUDY_ADMIN = 'study_admin',
  CONTRIBUTOR = 'contributor'
}

/**
 * Capturing heirarchy of roles. First role in each sub-list is given
 * the permissions of the roles that follow it.
 */
export const roleHierarchy: string[][] = [
  [Roles.OWNER, Roles.PROJECT_ADMIN],
  [Roles.PROJECT_ADMIN, Roles.STUDY_ADMIN],
  [Roles.STUDY_ADMIN, Roles.CONTRIBUTOR]
];
