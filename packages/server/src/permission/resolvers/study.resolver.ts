import { Resolver, Args, ID, Query, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { StudyPermissionModel } from '../models/study.model';
import { TokenContext } from '../../jwt/token.context';
import { TokenPayload } from '../../jwt/token.dto';
import { StudyPipe } from '../../study/pipes/study.pipe';
import { Study } from '../../study/study.model';
import * as casbin from 'casbin';
import { CASBIN_PROVIDER } from '../casbin.provider';
import { StudyPermissions } from '../permissions/study';
import { PermissionService } from '../permission.service';
import { UserModel } from '../../auth/user.model';

@UseGuards(JwtAuthGuard)
@Resolver(() => StudyPermissionModel)
export class StudyPermissionResolver {
  constructor(@Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
              private readonly permissionService: PermissionService) {}

  @Query(() => [StudyPermissionModel])
  async getStudyPermissions(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<StudyPermissionModel[]> {
    // Make sure the user has the ability to manage study permissions
    const hasPermission = await this.enforcer.enforce(requestingUser.id, StudyPermissions.GRANT_ACCESS, study._id);
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage study permissions');
    }

    return this.permissionService.getStudyPermissions(study, requestingUser);
  }

  @Mutation(() => Boolean)
  async grantStudyAdmin(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('user', { type: () => ID }) user: string,
    @Args('isAdmin', { type: () => Boolean }) isAdmin: boolean,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<boolean> {
    // Make sure the user has the ability to manage study permissions
    const hasPermission = await this.enforcer.enforce(requestingUser.id, StudyPermissions.GRANT_ACCESS, study._id.toString());
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage study permissions');
    }

    return this.permissionService.grantStudyAdmin(study, user, isAdmin, requestingUser);
  }

  @Mutation(() => Boolean)
  async grantContributor(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('user', { type: () => ID }) user: string,
    @Args('isContributor', { type: () => Boolean }) isContributor: boolean,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<boolean> {
    // Make sure the user has the ability to manage study permissions
    const hasPermission = await this.enforcer.enforce(requestingUser.id, StudyPermissions.GRANT_ACCESS, study._id.toString());
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage study permissions');
    }

    return this.permissionService.grantContributor(study, user, isContributor, requestingUser);
  }

  @Mutation(() => Boolean)
  async grantTrainedContributor(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('user', { type: () => ID }) user: string,
    @Args('isTrained', { type: () => Boolean }) isTrained: boolean,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<boolean> {
    // Make sure the user has the ability to manage study permissions
    const hasPermission = await this.enforcer.enforce(requestingUser.id, StudyPermissions.GRANT_ACCESS, study._id.toString());
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage study permissions');
    }

    return this.permissionService.grantTrainedContributor(study, user, isTrained, requestingUser);
  }

  @ResolveField('user', () => UserModel)
  resolveUser(@Parent() permission: StudyPermissionModel): any {
    return { __typename: 'UserModel', id: permission.user };
  }
}
