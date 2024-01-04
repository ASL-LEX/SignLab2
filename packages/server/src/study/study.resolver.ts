import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Project } from '../project/project.model';
import { Study } from './study.model';
import { ProjectPipe } from '../project/pipes/project.pipe';
import { StudyPipe } from './pipes/study.pipe';
import { StudyCreate } from './dtos/create.dto';
import { StudyService } from './study.service';
import { StudyCreatePipe } from './pipes/create.pipe';
import { UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { CASBIN_PROVIDER } from '../auth/casbin.provider';
import * as casbin from 'casbin';
import { StudyPermissions } from '../auth/permissions/study';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';

@UseGuards(JwtAuthGuard)
@Resolver(() => Study)
export class StudyResolver {
  constructor(
    private readonly studyService: StudyService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  @Mutation(() => Study)
  async createStudy(
    @Args('study', { type: () => StudyCreate }, StudyCreatePipe) study: StudyCreate,
    @TokenContext() user: TokenPayload
  ): Promise<Study> {
    if (!(await this.enforcer.enforce(user.id, StudyPermissions.CREATE, study.project))) {
      throw new UnauthorizedException('User cannot create studies on this project');
    }

    return this.studyService.create(study);
  }

  @Query(() => Boolean)
  async studyExists(
    @Args('name') name: string,
    @Args('project', { type: () => ID }, ProjectPipe) project: Project
  ): Promise<Boolean> {
    if (!(await this.enforcer.enforce(name, StudyPermissions.READ, project))) {
      throw new UnauthorizedException('User cannot read studies on this project');
    }

    return this.studyService.exists(name, project._id);
  }

  // TODO: Replace with user specific study query
  @Query(() => [Study])
  async findStudies(@Args('project', { type: () => ID }, ProjectPipe) project: Project): Promise<Study[]> {
    return this.studyService.findAll(project);
  }

  @Mutation(() => Boolean)
  async deleteStudy(@Args('study', { type: () => ID }, StudyPipe) study: Study): Promise<boolean> {
    if (!(await this.enforcer.enforce(study.name, StudyPermissions.DELETE, study._id))) {
      throw new UnauthorizedException('User cannot delete studies on this project');
    }

    await this.studyService.delete(study);
    return true;
  }

  @Mutation(() => Study)
  async changeStudyName(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('newName') newName: string
  ): Promise<Study> {
    if (!(await this.enforcer.enforce(study.name, StudyPermissions.UPDATE, study._id))) {
      throw new UnauthorizedException('User cannot update studies on this project');
    }

    return this.studyService.changeName(study, newName);
  }

  @Mutation(() => Study)
  async changeStudyDescription(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('newDescription') newDescription: string
  ): Promise<Study> {
    if (!(await this.enforcer.enforce(study.name, StudyPermissions.UPDATE, study._id))) {
      throw new UnauthorizedException('User cannot update studies on this project');
    }

    return this.studyService.changeDescription(study, newDescription);
  }
}
