import { TagField, TagFieldType, TagFieldUnion } from '../models/tag-field.model';
import { ResolveField, Parent, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { TagFieldService } from '../services/tag-field.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => TagField)
export class TagFieldResolver {
  constructor(private readonly tagFieldService: TagFieldService) {}

  @ResolveField(() => TagFieldUnion, { nullable: true })
  async field(@Parent() tagField: TagField): Promise<typeof TagFieldUnion | null> {
    return this.tagFieldService.produceField(tagField);
  }
}
