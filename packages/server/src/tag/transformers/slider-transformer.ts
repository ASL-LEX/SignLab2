import { Injectable } from '@nestjs/common';
import { FieldTransformer } from './field-transformer';
import { JsonSchema, UISchemaElement, isNumberControl } from '@jsonforms/core';
import { TokenPayload } from '../../jwt/token.dto';
import { Tag } from '../models/tag.model';
import { TagField, TagFieldType } from '../models/tag-field.model';

@Injectable()
export class SliderFieldTransformer implements FieldTransformer {
  async transformField(
    _tag: Tag,
    data: number,
    _uischema: UISchemaElement,
    _schema: JsonSchema,
    _user: TokenPayload,
    property: string
  ): Promise<TagField> {
    return {
      name: property,
      data,
      type: TagFieldType.SLIDER
    }
  }
}

export const SliderFieldTransformerTest = (uischema: UISchemaElement, schema: JsonSchema) => {
  if (isNumberControl(uischema, schema, {} as any)) {
    return 10;
  }
  return -1;
};
