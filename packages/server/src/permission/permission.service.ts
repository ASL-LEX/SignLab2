import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CASBIN_PROVIDER } from './casbin.provider';
import * as casbin from 'casbin';
import { Roles } from './permissions/roles';
import { UserService } from '../auth/services/user.service';
import { Project } from '../project/project.model';
import { TokenPayload } from '../jwt/token.dto';
import { Study } from '../study/study.model';
import { ProjectPermissionModel } from './models/project.model';
import { StudyPermissionModel } from './models/study.model';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly userService: UserService
  ) {}

  /** requestingUser must be an owner themselves */
  async grantOwner(targetUser: string, organization: string): Promise<void> {
    await this.enforcer.addPolicy(targetUser, Roles.OWNER, organization);
  }

  async getProjectPermissions(project: Project, requestingUser: TokenPayload): Promise<ProjectPermissionModel[]> {
    // Get all the users associated with the organization
    const users = await this.userService.getUsersForProject(requestingUser.projectId);

    // Create the cooresponding permission representation
    const permissions = await Promise.all(
      users.map(async (user) => {
        const hasRole = await this.enforcer.enforce(user.id, Roles.PROJECT_ADMIN, project._id);
        const editable = !(await this.enforcer.enforce(user.id, Roles.OWNER, project._id));

        return {
          user: user.id,
          isProjectAdmin: hasRole,
          editable
        };
      })
    );

    return permissions;
  }

  async grantProjectPermissions(
    project: Project,
    user: string,
    isAdmin: boolean,
    requestingUser: TokenPayload
  ): Promise<boolean> {
    // Make sure the target user is not an owner
    const isOwner = await this.enforcer.enforce(user, Roles.OWNER, project._id);
    if (isOwner) {
      throw new UnauthorizedException('Target user is an owner');
    }

    // The user cannot change its own permissions
    if (user === requestingUser.id) {
      throw new UnauthorizedException('Cannot change your own permissions');
    }

    // Otherwise grant the permissions
    if (isAdmin) {
      await this.enforcer.addPolicy(user, Roles.PROJECT_ADMIN, project._id.toString());
    } else {
      await this.enforcer.removePolicy(user, Roles.PROJECT_ADMIN, project._id.toString());
    }

    return true;
  }

  async getStudyPermissions(study: Study, requestingUser: TokenPayload): Promise<StudyPermissionModel[]> {
    // Get all the users associated with the organization
    const users = await this.userService.getUsersForProject(requestingUser.projectId);

    // Create the cooresponding permission representation
    const permissions = await Promise.all(
      users.map(async (user) => {
        const isStudyAdmin = await this.enforcer.enforce(user.id, Roles.STUDY_ADMIN, study._id.toString());
        const isStudyAdminEditable = !(await this.enforcer.enforce(user.id, Roles.PROJECT_ADMIN, study._id.toString()));

        const isContributor = await this.enforcer.enforce(user.id, Roles.CONTRIBUTOR, study._id.toString());
        const isContributorEditable = !(await this.enforcer.enforce(user.id, Roles.STUDY_ADMIN, study._id.toString()));

        const isTrained = await this.enforcer.enforce(user.id, Roles.TRAINED_CONTRIBUTOR, study._id.toString());

        return {
          user: user.id,
          isStudyAdmin,
          isStudyAdminEditable,
          isContributor,
          isContributorEditable,
          isTrained,
          isTrainedEditable: true
        };
      })
    );

    // return permissions;
    return permissions;
  }
}
