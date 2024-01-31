import { Injectable } from '@nestjs/common';
import { FieldTransformer } from './field-transformer';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

@Injectable()
export class VideoFieldTransformer implements FieldTransformer {
  async transformField (data: unknown, uischema: UISchemaElement, schema: JsonSchema): Promise<any> {
    return data;
  }
}

export const VideoFieldTransformerTest = (uischema: UISchemaElement, _schema: JsonSchema) => {
  if (uischema.options && uischema.options.customType && uischema.options.customType === 'video') {
    return 10;
  }
  return -1;
};
