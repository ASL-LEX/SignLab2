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
}
