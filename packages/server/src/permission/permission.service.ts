import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CASBIN_PROVIDER } from './casbin.provider';
import * as casbin from 'casbin';
import { Roles } from './permissions/roles';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  /** requestingUser must be an owner themselves */
  async grantOwner(targetUser: string, requestingUser: string, organization: string): Promise<void> {
    // Make sure the requesting user is an owner
    const isOwner = await this.enforcer.enforce(requestingUser, Roles.OWNER, organization);
    if (!isOwner) {
      throw new UnauthorizedException('Requesting user is not an owner');
    }

    await this.enforcer.addPolicy(targetUser, Roles.OWNER, organization);
  }
}
