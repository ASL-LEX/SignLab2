import { Resolver, Mutation, Args, ID, Query, ResolveField, Parent } from '@nestjs/graphql';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';
import { PermissionService } from './permission.service';
import { OrganizationContext } from 'src/organization/organization.context';
import { Organization } from 'src/organization/organization.model';
import { ProjectPipe } from '../project/pipes/project.pipe';
import { Project } from '../project/project.model';
import { Permission, UserModel } from './permission.model';

@UseGuards(JwtAuthGuard)
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Boolean)
  async grantOwner(
    @Args('targetUser', { type: () => ID }) targetUser: string,
    @TokenContext() requestingUser: TokenPayload,
    @OrganizationContext() organization: Organization
  ): Promise<boolean> {
    await this.permissionService.grantOwner(targetUser, requestingUser.id, organization._id);
    return true;
  }

  @Query(() => [Permission])
  async getProjectPermissions(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @TokenContext() requestingUser: TokenPayload
  ): Promise<Permission[]> {
    return this.permissionService.getProjectPermissions(project, requestingUser);
  }

  @ResolveField('user', () => UserModel)
  resolveUser(@Parent() permission: Permission): any {
    return { __typename: 'UserModel', id: permission.user };
  }
}
