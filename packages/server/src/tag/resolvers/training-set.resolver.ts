import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { Entry } from '../../entry/models/entry.model';
import { EntriesPipe } from '../../entry/pipes/entry.pipe';
import { TokenPayload } from '../../jwt/token.dto';
import { TokenContext } from '../../jwt/token.context';
import { StudyPipe } from '../../study/pipes/study.pipe';
import { Study } from '../../study/study.model';
import { TrainingSetService } from '../services/training-set.service';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CASBIN_PROVIDER } from 'src/permission/casbin.provider';
import * as casbin from 'casbin';
import { StudyPermissions } from 'src/permission/permissions/study';
import { JwtAuthGuard } from '../../jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class TrainingSetResolver {
  constructor(
    private readonly trainingService: TrainingSetService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  @Mutation(() => Boolean)
  async createTrainingSet(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('entries', { type: () => [ID] }, EntriesPipe) entries: Entry[],
    @TokenContext() user: TokenPayload
  ): Promise<boolean> {
    if (!(await this.enforcer.enforce(user.user_id, StudyPermissions.CREATE, study._id.toString()))) {
      throw new UnauthorizedException('User cannot create a training set for this study');
    }
    await this.trainingService.create(study, entries);
    return true;
  }
}
