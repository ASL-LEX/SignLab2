import { BadRequestException, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { OrganizationContext } from 'src/organization/organization.context';
import { Organization } from 'src/organization/organization.model';
import { ProjectCreate } from './dtos/create.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { ProjectPipe } from './pipes/project.pipe';
import { JwtAuthGuard } from '../auth/jwt.guard';


@UseGuards(JwtAuthGuard)
@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  async signLabCreateProject(@Args('project') project: ProjectCreate, @OrganizationContext() organization: Organization): Promise<Project> {
    // Make sure the project name is unique for the given organization
    if (await this.projectExists(project.name, organization)) {
      throw new BadRequestException(`Project with name ${project.name} already exists`);
    }
    return this.projectService.create(project, organization._id);
  }

  @Query(() => Boolean)
  async projectExists(@Args('name') name: string, @OrganizationContext() organization: Organization): Promise<boolean> {
    return this.projectService.exists(name, organization._id);
  }

  // TODO: Handle Project deletion
  @Mutation(() => Boolean)
  async deleteProject(@Args('project', { type: () => ID }, ProjectPipe) project: Project): Promise<boolean> {
    await this.projectService.delete(project);
    return true;
  }

  // TODO: Handle the ability to get project based on user access
  @Query(() => [Project])
  async getProjects(@OrganizationContext() organization: Organization): Promise<Project[]> {
    return this.projectService.findAll(organization._id);
  }
}
