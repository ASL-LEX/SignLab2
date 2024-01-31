import { Resolver, Mutation, Query, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { TagService } from '../services/tag.service';
import { Tag } from '../models/tag.model';
import { StudyPipe } from '../../study/pipes/study.pipe';
import { Study } from '../../study/study.model';
import { EntriesPipe, EntryPipe } from '../../entry/pipes/entry.pipe';
import { Entry } from '../../entry/models/entry.model';
import { TagPipe } from '../pipes/tag.pipe';
import JSON from 'graphql-type-json';
import { Inject, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { CASBIN_PROVIDER } from '../../permission/casbin.provider';
import * as casbin from 'casbin';
import { TokenContext } from '../../jwt/token.context';
import { TokenPayload } from '../../jwt/token.dto';
import { StudyPermissions } from '../../permission/permissions/study';
import { TagPermissions } from 'src/permission/permissions/tag';

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

  @Mutation(() => Boolean)
  async setEntryEnabled(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('entry', { type: () => ID }, EntryPipe) entry: Entry,
    @Args('enabled', { type: () => Boolean }) enabled: boolean,
    @TokenContext() user: TokenPayload
  ): Promise<boolean> {
    if (!(await this.enforcer.enforce(user.id, TagPermissions.UPDATE, study._id.toString()))) {
      throw new UnauthorizedException('User cannot update tags in this study');
    }
    await this.tagService.setEnabled(study, entry, enabled);
    return true;
  }

  @Query(() => Boolean)
  async isEntryEnabled(
    @Args('study', { type: () => ID }, StudyPipe) study: Study,
    @Args('entry', { type: () => ID }, EntryPipe) entry: Entry,
    @TokenContext() user: TokenPayload
  ): Promise<Boolean> {
    if (!(await this.enforcer.enforce(user.id, TagPermissions.READ, study._id.toString()))) {
      throw new UnauthorizedException('User cannot read tags in this study');
    }
    return this.tagService.isEntryEnabled(study, entry);
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
