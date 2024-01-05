import { Args, Resolver, Mutation, ID } from '@nestjs/graphql';
import { TokenContext } from '../../jwt/token.context';
import { OrganizationContext } from '../../organization/organization.context';
import { TokenPayload } from '../../jwt/token.dto';
import { Organization } from '../../organization/organization.model';
import * as casbin from 'casbin';
import { CASBIN_PROVIDER } from '../casbin.provider';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { Roles } from '../permissions/roles';
import { PermissionService } from '../permission.service';

@Resolver()
export class OwnerPermissionResolver {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly permissionService: PermissionService
  ) {}

  @Mutation(() => Boolean)
  async grantOwner(
    @Args('targetUser', { type: () => ID }) targetUser: string,
    @TokenContext() requestingUser: TokenPayload,
    @OrganizationContext() organization: Organization
  ): Promise<boolean> {
    // Make sure the requesting user is an owner
    const isOwner = await this.enforcer.enforce(requestingUser, Roles.OWNER, organization);
    if (!isOwner) {
      throw new UnauthorizedException('Requesting user is not an owner');
    }

    await this.permissionService.grantOwner(targetUser, organization._id);
    return true;
  }
}
