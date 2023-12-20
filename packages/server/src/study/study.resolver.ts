import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { Project } from '../project/project.model';
import { Study } from './study.model';
import { ProjectPipe } from '../project/pipes/project.pipe';
import { StudyPipe } from './pipes/study.pipe';
import { StudyCreate } from './dtos/create.dto';
import { StudyService } from './study.service';
import { StudyCreatePipe } from './pipes/create.pipe';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => Study)
export class StudyResolver {
  constructor(private readonly studyService: StudyService) {}

  @Mutation(() => Study)
  async createStudy(@Args('study', { type: () => StudyCreate }, StudyCreatePipe) study: StudyCreate): Promise<Study> {
    // TODO: Verify the user has access to the given project
    return this.studyService.create(study);
  }

  @Query(() => Boolean)
  async studyExists(@Args('name') name: string, @Args('project', { type: () => ID }, ProjectPipe) project: Project): Promise<Boolean> {
    return this.studyService.exists(name, project._id);
  }

  // TODO: Replace with user specific study query
  @Query(() => [Study])
  async findStudies(@Args('project', { type: () => ID }, ProjectPipe) project: Project): Promise<Study[]> {
    return this.studyService.findAll(project);
  }

  @Mutation(() => Boolean)
  async deleteStudy(@Args('study', { type: () => ID }, StudyPipe) study: Study): Promise<boolean> {
    await this.studyService.delete(study);
    return true;
  }

  @Mutation(() => Study)
  async changeStudyName(@Args('study',{ type: () => ID }, StudyPipe) study: Study, @Args('newName') newName: string): Promise<Study> {
    return this.studyService.changeName(study, newName);
  }

  @Mutation(() => Study)
  async changeStudyDescription(@Args('study', { type: () => ID }, StudyPipe) study: Study, @Args('newDescription') newDescription: string): Promise<Study> {
    return this.studyService.changeDescription(study, newDescription);
  }
}
