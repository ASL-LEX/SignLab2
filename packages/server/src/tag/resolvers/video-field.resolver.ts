import { Resolver, Query, Args, Mutation, ID, ResolveField, Parent } from '@nestjs/graphql';
import { VideoFieldService } from '../services/video-field.service';
import { TagPipe } from '../pipes/tag.pipe';
import { Tag } from '../models/tag.model';
import { VideoField } from '../models/video-field.model';
import { TokenContext } from '../../jwt/token.context';
import { TokenPayload } from '../../jwt/token.dto';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { CASBIN_PROVIDER } from '../../permission/casbin.provider';
import * as casbin from 'casbin';
import { TagPermissions } from '../../permission/permissions/tag';

@Resolver(() => VideoField)
export class VideoFieldResolver {
  constructor(private readonly videoFieldService: VideoFieldService, @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer) {}

  @Mutation(() => String)
  async saveVideoField(
    @Args('tag', { type: () => ID }, TagPipe) tag: Tag,
    @Args('field', { type: () => ID }) field: string,
    @Args('index', { type: () => Number }) index: number,
    @TokenContext() user: TokenPayload
  ): Promise<VideoField> {
    // Make sure the user first has permission to create video fields for this tag
    if (!(await this.enforcer.enforce(user.id, TagPermissions.CREATE, tag.study.toString()))) {
      throw new UnauthorizedException('User does not have permission to create video fields for this tag');
    }

    // Make sure its the user assigned to the tag
    if (user.id !== tag.user?.toString()) {
      throw new UnauthorizedException('User does not have permission to create video fields for this tag');
    }

    return this.videoFieldService.saveVideoField(tag, field, index);
  }

  @ResolveField(() => String)
  async uploadURL(@Parent() videoField: VideoField, @TokenContext() user: TokenPayload): Promise<string> {
    if (!(await this.enforcer.enforce(user.id, TagPermissions.CREATE, videoField.tag.toString()))) {
      throw new UnauthorizedException('User does not have permission to create video fields for this tag');
    }

    return this.videoFieldService.getUploadURL(videoField);
  }
}
