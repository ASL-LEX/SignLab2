import { Resolver, Args, Mutation, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { VideoFieldIntermediateService } from '../services/video-field-inter.service';
import { TagPipe } from '../pipes/tag.pipe';
import { Tag } from '../models/tag.model';
import { VideoFieldIntermediate } from '../models/video-field-inter.model';
import { TokenContext } from '../../jwt/token.context';
import { TokenPayload } from '../../jwt/token.dto';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CASBIN_PROVIDER } from '../../permission/casbin.provider';
import * as casbin from 'casbin';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { Roles } from 'src/permission/permissions/roles';

@UseGuards(JwtAuthGuard)
@Resolver(() => VideoFieldIntermediate)
export class VideoFieldIntermediateResolver {
  constructor(
    private readonly videoFieldService: VideoFieldIntermediateService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly tagPipe: TagPipe
  ) {}

  @Mutation(() => VideoFieldIntermediate)
  async saveVideoField(
    @Args('tag', { type: () => ID }, TagPipe) tag: Tag,
    @Args('field') field: string,
    @Args('index', { type: () => Int }) index: number,
    @TokenContext() user: TokenPayload
  ): Promise<VideoFieldIntermediate> {
    // Make sure the user first has permission to create video fields for this tag
    if (!(await this.enforcer.enforce(user.user_id, Roles.CONTRIBUTOR, tag.study.toString()))) {
      throw new UnauthorizedException('User does not have permission to create video fields for this tag');
    }

    // Make sure its the user assigned to the tag
    if (user.user_id !== tag.user?.toString()) {
      throw new UnauthorizedException('User does not have permission to create video fields for this tag');
    }

    return this.videoFieldService.saveVideoField(tag, field, index);
  }

  @ResolveField(() => String)
  async uploadURL(@Parent() videoField: VideoFieldIntermediate, @TokenContext() user: TokenPayload): Promise<string> {
    const tag = await this.tagPipe.transform(videoField.tag);
    if (!tag) {
      throw new Error(`Tag ${videoField.tag} not found`);
    }
    if (!(await this.enforcer.enforce(user.user_id, Roles.CONTRIBUTOR, tag.study.toString()))) {
      throw new UnauthorizedException('User does not have permission to create video fields for this tag');
    }

    return this.videoFieldService.getUploadURL(videoField);
  }
}
