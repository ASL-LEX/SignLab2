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
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => ProjectPermissionModel)
export class ProjectPermissionResolver {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly permissionService: PermissionService,
    private readonly userService: UserService
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

  @ResolveField('user', () => User)
  resolveUser(@Parent() permission: ProjectPermissionModel, @TokenContext() requestingUser: TokenPayload): any {
    return this.userService.getUserById(requestingUser.firebase.tenant, permission.user);
  }
}
