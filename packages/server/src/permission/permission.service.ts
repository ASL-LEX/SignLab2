import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CASBIN_PROVIDER } from './casbin.provider';
import * as casbin from 'casbin';
import { Roles } from './permissions/roles';
import { UserService } from '../auth/services/user.service';
import { Project } from '../project/project.model';
import { TokenPayload } from '../jwt/token.dto';
import { Permission } from './permission.model';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly userService: UserService
  ) {}

  /** requestingUser must be an owner themselves */
  async grantOwner(targetUser: string, requestingUser: string, organization: string): Promise<void> {
    await this.enforcer.addPolicy(targetUser, Roles.OWNER, organization);
  }

  async getProjectPermissions(project: Project, requestingUser: TokenPayload): Promise<Permission[]> {
    // Get all the users associated with the organization
    const users = await this.userService.getUsersForProject(requestingUser.projectId);

    // Create the cooresponding permission representation
    const permissions = await Promise.all(
      users.map(async (user) => {
        const hasRole = await this.enforcer.enforce(user.id, Roles.PROJECT_ADMIN, project._id);
        const editable = !(await this.enforcer.enforce(user.id, Roles.OWNER, project._id));

        return {
          user: user.id,
          role: Roles.PROJECT_ADMIN,
          hasRole,
          editable
        };
      })
    );

    return permissions;
  }

  async grantProjectPermissions(project: Project, user: string, isAdmin: boolean, requestingUser: TokenPayload): Promise<boolean> {
    // Make sure the target user is not an owner
    const isOwner = await this.enforcer.enforce(user, Roles.OWNER, project._id);
    if (isOwner) {
      throw new UnauthorizedException('Target user is an owner');
    }

    // The user cannot change its own permissions
    if (user === requestingUser.id) {
      throw new UnauthorizedException('Cannot change your own permissions');
    }

      console.log(project);
      console.log(user);

    // Otherwise grant the permissions
    if (isAdmin) {
      await this.enforcer.addPolicy(user, Roles.PROJECT_ADMIN, project._id);
    } else {
      console.log('Has policy: ', await this.enforcer.enforce(user, Roles.PROJECT_ADMIN, project._id));
      const result = await this.enforcer.removePolicy(user, Roles.PROJECT_ADMIN, project._id);
      // console.log(result);
    }

    return true;
  }
}
