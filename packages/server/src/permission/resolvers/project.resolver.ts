import { Resolver, Mutation, Args, ID, Query, ResolveField, Parent } from '@nestjs/graphql';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { ProjectPermissionModel } from '../models/project.model';
import { TokenContext } from '../../jwt/token.context';
import { TokenPayload } from '../../jwt/token.dto';
import { ProjectPipe } from '../../project/pipes/project.pipe';
import { Project } from '../../project/project.model';
import * as casbin from 'casbin';
import { CASBIN_PROVIDER } from '../casbin.provider';
import { ProjectPermissions } from '../permissions/project';
import { PermissionService } from '../permission.service';
import { UserModel } from '../../auth/user.model';

@UseGuards(JwtAuthGuard)
@Resolver(() => ProjectPermissionModel)
export class ProjectPermissionResolver {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly permissionService: PermissionService
  ) {}

  @Query(() => [ProjectPermissionModel])
  async getProjectPermissions(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<ProjectPermissionModel[]> {
    // Make sure the user has the ability to manage project permissions
    const hasPermission = await this.enforcer.enforce(
      requestingUser.user_id,
      ProjectPermissions.GRANT_ADMIN,
      project._id
    );
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage project permissions');
    }

    return this.permissionService.getProjectPermissions(project, requestingUser);
  }

  @Mutation(() => Boolean)
  async grantProjectPermissions(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @Args('user', { type: () => ID }) user: string,
    @Args('isAdmin', { type: () => Boolean }) isAdmin: boolean,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<boolean> {
    const hasPermission = await this.enforcer.enforce(
      requestingUser.user_id,
      ProjectPermissions.GRANT_ADMIN,
      project._id
    );
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage project permissions');
    }

    return this.permissionService.grantProjectPermissions(project, user, isAdmin, requestingUser);
  }

  @ResolveField('user', () => UserModel)
  resolveUser(@Parent() permission: ProjectPermissionModel): any {
    return { __typename: 'UserModel', id: permission.user };
  }
}
