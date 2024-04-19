import { Injectable } from '@nestjs/common';
import { FieldTransformer } from './field-transformer';
import { JsonSchema, UISchemaElement, isStringControl } from '@jsonforms/core';
import { TokenPayload } from '../../jwt/token.dto';
import { Tag } from '../models/tag.model';
import { TagField, TagFieldType } from '../models/tag-field.model';

@Injectable()
export class FreeTextFieldTransformer implements FieldTransformer {
  async transformField(
    _tag: Tag,
    data: string,
    _uischema: UISchemaElement,
    _schema: JsonSchema,
    _user: TokenPayload,
    property: string
  ): Promise<TagField> {
    return {
      name: property,
      data,
      type: TagFieldType.FREE_TEXT
    };
  }
}

export const FreeTextFieldTransformerTest = (uischema: UISchemaElement, schema: JsonSchema) => {
  if (isStringControl(uischema, schema, {} as any)) {
    return 10;
  }
  return -1;
};
