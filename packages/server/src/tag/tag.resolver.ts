import { Resolver, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from './tag.model';
import { StudyPipe } from '../study/pipes/study.pipe';
import { Study } from '../study/study.model';
import { EntriesPipe, EntryPipe } from '../entry/pipes/entry.pipe';
import { Entry } from '../entry/models/entry.model';
import { TagPipe } from './pipes/tag.pipe';
import JSON from 'graphql-type-json';
import { Inject, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { CASBIN_PROVIDER } from 'src/permission/casbin.provider';
import * as casbin from 'casbin';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';
import { StudyPermissions } from '../permission/permissions/study';

// TODO: Add permissioning
@UseGuards(JwtAuthGuard)
@Resolver(() => Tag)
export class TagResolver {
  constructor(
    private readonly tagService: TagService,
    private readonly entryPipe: EntryPipe,
    private readonly studyPipe: StudyPipe,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  @Mutation(() => [Tag])
  async createTags(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('entries', { type: () => [ID] }, EntriesPipe) entries: Entry[],
    @TokenContext() user: TokenPayload
  ) {
    if (!(await this.enforcer.enforce(user.id, StudyPermissions.CREATE, study._id.toString()))) {
      throw new UnauthorizedException('User cannot add tags to this study');
    }
    return this.tagService.createTags(study, entries);
  }

  @Mutation(() => Tag, { nullable: true })
  async assignTag(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @TokenContext() user: TokenPayload
  ): Promise<Tag | null> {
    return this.tagService.assignTag(study, user.id);
  }

  @Mutation(() => Boolean)
  async completeTag(
    @Args('tag', { type: () => ID }, TagPipe) tag: Tag,
    @Args('data', { type: () => JSON }) data: any
  ): Promise<boolean> {
    // TODO: Add user context and verify the correct user has completed the tag
    await this.tagService.complete(tag, data);
    return true;
  }

  @ResolveField(() => Entry)
  async entry(@Parent() tag: Tag): Promise<Entry> {
    return this.entryPipe.transform(tag.entry);
  }

  @ResolveField(() => Study)
  async study(@Parent() tag: Tag): Promise<Study> {
    return this.studyPipe.transform(tag.study);
  }
}
