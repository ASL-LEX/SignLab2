import { BadRequestException, UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { OrganizationContext } from 'src/organization/organization.context';
import { Organization } from 'src/organization/organization.model';
import { ProjectCreate } from './dtos/create.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { ProjectPipe } from './pipes/project.pipe';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';
import { CASBIN_PROVIDER } from '../permission/casbin.provider';
import * as casbin from 'casbin';
import { ProjectPermissions } from '../permission/permissions/project';
import { OrganizationGuard } from '../organization/organization.guard';

@UseGuards(JwtAuthGuard, OrganizationGuard)
@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  @Mutation(() => Project)
  async signLabCreateProject(
    @Args('project') project: ProjectCreate,
    @OrganizationContext() organization: Organization,
    @TokenContext() user: TokenPayload
  ): Promise<Project> {
    // Make sure the user is allowed to create projects
    if (!(await this.enforcer.enforce(user.user_id, ProjectPermissions.CREATE, organization._id))) {
      throw new UnauthorizedException('User does not have permission to create projects');
    }

    // Make sure the project name is unique for the given organization
    if (await this.projectExists(project.name, organization, user)) {
      throw new BadRequestException(`Project with name ${project.name} already exists`);
    }
    return this.projectService.create(project, organization._id);
  }

  @Query(() => Boolean)
  async projectExists(
    @Args('name') name: string,
    @OrganizationContext() organization: Organization,
    @TokenContext() _user: TokenPayload
  ): Promise<boolean> {
    return this.projectService.exists(name, organization._id);
  }

  // TODO: Handle Project deletion
  @Mutation(() => Boolean)
  async deleteProject(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @TokenContext() user: TokenPayload,
    @OrganizationContext() organization: Organization
  ): Promise<boolean> {
    if (!(await this.enforcer.enforce(user.user_id, ProjectPermissions.DELETE, organization._id))) {
      throw new UnauthorizedException('User does not have permission to delete projects');
    }

    await this.projectService.delete(project);
    return true;
  }

  @Query(() => [Project])
  async getProjects(
    @OrganizationContext() organization: Organization,
    @TokenContext() user: TokenPayload
  ): Promise<Project[]> {
    return this.projectService.findAllForUser(user, organization._id);
  }
}
