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
  @ResolveField(() => TagFieldUnion)
  async field(@Parent() tagField: TagField): Promise<typeof TagFieldUnion> {
    switch(tagField.type) {
      case TagFieldType.BOOLEAN:
        return { value: tagField.data } as BooleanField;
      case TagFieldType.FREE_TEXT:
        return { value: tagField.data } as FreeTextField;
      case TagFieldType.NUMERIC:
        return { value: tagField.data } as NumericField;
      case TagFieldType.SLIDER:
        return { value: tagField.data } as SliderField;
      default:
        throw new Error(`Unsupported tag field type: ${tagField.type}`);
    }
  }
}
