import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { StudyPipe } from '../../study/pipes/study.pipe';
import { ProjectPipe } from '../../project/pipes/project.pipe';
import { TokenContext } from '../../jwt/token.context';
import { Permission } from '../models/permission.model';
import { TokenPayload } from '../../jwt/token.dto';
import { Study } from '../../study/study.model';
import { Project } from '../../project/project.model';
import { PermissionService } from '../permission.service';
import { OrganizationContext } from '../../organization/organization.context';
import { Organization } from '../../organization/organization.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class PermissionResolver {
  constructor(private readonly studyPipe: StudyPipe,
              private readonly projectPipe: ProjectPipe,
              private readonly permissionService: PermissionService) {}

  @Query(() => Permission)
  async getRoles(@Args('project', { type: () => ID, nullable: true }) projectID: string | null,
                 @Args('study', { type: () => ID, nullable: true }) studyID: string | null,
                 @TokenContext() tokenContext: TokenPayload,
                 @OrganizationContext() organization: Organization): Promise<Permission> {
    let project: Project | null = null;
    let study: Study | null = null;

    if (projectID) {
      project = await this.projectPipe.transform(projectID);
    }
    if (studyID) {
      study = await this.studyPipe.transform(studyID);
    }

    return this.permissionService.getRoles(tokenContext, organization, project, study);
  }
}
