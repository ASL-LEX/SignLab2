import { TagField, TagFieldType, TagFieldUnion } from '../models/tag-field.model';
import { ResolveField, Parent, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { BooleanField } from '../models/boolean-field.model';
import { FreeTextField } from '../models/free-text-field.model';
import { NumericField } from '../models/numeric-field.model';
import { SliderField } from '../models/slider-field.model';

@UseGuards(JwtAuthGuard)
@Resolver(() => TagField)
export class TagFieldResolver {
  @ResolveField(() => TagFieldUnion, { nullable: true })
  async field(@Parent() tagField: TagField): Promise<typeof TagFieldUnion | null> {
    if (!tagField.data) {
      return null;
    }
    switch(tagField.type) {
      case TagFieldType.BOOLEAN:
        return new BooleanField(tagField.data);
      case TagFieldType.FREE_TEXT:
        return new FreeTextField(tagField.data);
      case TagFieldType.NUMERIC:
        return new NumericField(tagField.data);
      case TagFieldType.SLIDER:
        return new SliderField(tagField.data);
      default:
        throw new Error(`Unsupported tag field type: ${tagField.type}`);
    }
  }
}
