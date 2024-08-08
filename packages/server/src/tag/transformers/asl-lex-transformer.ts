import { Injectable } from '@nestjs/common';
import { FieldTransformer } from './field-transformer';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { TokenPayload } from '../../jwt/token.dto';
import { Tag } from '../models/tag.model';
import { TagField, TagFieldType } from '../models/tag-field.model';

@Injectable()
export class AslLexFieldTransformer implements FieldTransformer {
  async transformField(
    _tag: Tag,
    data: string,
    uischema: UISchemaElement,
    _schema: JsonSchema,
    _user: TokenPayload,
    property: string
  ): Promise<TagField> {
    return {
      name: property,
      data: { key: data, lexicon: uischema.options?.lexicon._id },
      type: TagFieldType.ASL_LEX
    };
  }
}

export const AslLexFieldTransformerTest = (uischema: UISchemaElement, _schema: JsonSchema) => {
  if (
    uischema.options != undefined &&
    uischema.options.customType != undefined &&
    uischema.options.customType == 'asl-lex'
  ) {
    return 15;
  }
  return -1;
};
