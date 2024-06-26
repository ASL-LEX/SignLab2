import { Injectable } from '@nestjs/common';
import { Study } from '../../study/study.model';
import { FieldTransformerFactory } from '../transformers/field-transformer-factory';
import { TokenPayload } from '../../jwt/token.dto';
import { Tag } from '../../tag/models/tag.model';
import { TagField } from '../models/tag-field.model';

@Injectable()
export class TagTransformer {
  constructor(private readonly fieldTransformerFactory: FieldTransformerFactory) {}

  /**
   * Transforms the tag data. Takes in the whole tag and produces the modified
   * tag data.
   */
  async transformTagData(tag: Tag, data: any, study: Study, user: TokenPayload): Promise<TagField[]> {
    const schema = study.tagSchema.dataSchema;
    const uischema = study.tagSchema.uiSchema;

    if (!schema.properties) {
      return data;
    }

    const fields: TagField[] = [];

    for (const field in schema.properties) {
      // Get the schema and ui schema for the field
      const fieldSchema = schema.properties[field];
      const fieldUiSchema = uischema.elements.find((element) => (element as any).scope === `#/properties/${field}`);

      // If the field UI schema is not found, throw an error
      if (!fieldUiSchema) {
        throw new Error(`Could not find ui schema for field ${field}`);
      }

      // Try to get the transformer for the field
      const transformer = this.fieldTransformerFactory.getTransformer(fieldUiSchema, fieldSchema);

      if (!transformer) {
        throw new Error(`Unsupported field type for field ${field}`);
      }

      // Apply the transformation if present, otherwise just return the data
      const transformed = await transformer.transformField(tag, data[field], fieldUiSchema, fieldSchema, user, field);
      fields.push(transformed);
    }

    return fields;
  }
}
