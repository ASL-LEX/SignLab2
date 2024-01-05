import { Resolver, Mutation, Args, ID, Query, ResolveField, Parent } from '@nestjs/graphql';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';
import { PermissionService } from './permission.service';
import { OrganizationContext } from '../organization/organization.context';
import { Organization } from '../organization/organization.model';
import { ProjectPipe } from '../project/pipes/project.pipe';
import { Project } from '../project/project.model';
import { Permission, UserModel } from './permission.model';
import * as casbin from 'casbin';
import { CASBIN_PROVIDER } from './casbin.provider';
import { Roles } from './permissions/roles';
import { ProjectPermissions } from './permissions/project';

@UseGuards(JwtAuthGuard)
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(
    private readonly permissionService: PermissionService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
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

    await this.permissionService.grantOwner(targetUser, requestingUser.id, organization._id);
    return true;
  }

  @Query(() => [Permission])
  async getProjectPermissions(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<Permission[]> {
    // Make sure the user has the ability to manage project permissions
    const hasPermission = await this.enforcer.enforce(requestingUser.id,
                                                      ProjectPermissions.GRANT_ADMIN,
                                                      project._id);
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage project permissions');
    }

    return this.permissionService.getProjectPermissions(project, requestingUser);
  }

  @ResolveField('user', () => UserModel)
  resolveUser(@Parent() permission: Permission): any {
    return { __typename: 'UserModel', id: permission.user };
  }
}
