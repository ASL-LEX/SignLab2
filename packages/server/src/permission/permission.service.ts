import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CASBIN_PROVIDER } from './casbin.provider';
import * as casbin from 'casbin';
import { Roles } from './permissions/roles';
import { UserService } from '../auth/services/user.service';
import {Project} from 'src/project/project.model';
import {TokenPayload} from 'src/jwt/token.dto';

@Injectable()
export class PermissionService {
  constructor(@Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
              private readonly userService: UserService) {}

  /** requestingUser must be an owner themselves */
  async grantOwner(targetUser: string, requestingUser: string, organization: string): Promise<void> {
    // Make sure the requesting user is an owner
    const isOwner = await this.enforcer.enforce(requestingUser, Roles.OWNER, organization);
    if (!isOwner) {
      throw new UnauthorizedException('Requesting user is not an owner');
    }

    await this.enforcer.addPolicy(targetUser, Roles.OWNER, organization);
  }

  async getProjectPermissions(project: Project, requestingUser: TokenPayload): Promise<boolean> {
    // Get all the users associated with the organization
    const users = await this.userService.getUsersForProject(requestingUser.projectId);
    console.log(users);

    return true;
  }
}
