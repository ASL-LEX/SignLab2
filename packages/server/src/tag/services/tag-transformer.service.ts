import { Injectable } from '@nestjs/common';
import { Tag } from '../models/tag.model';
import { Study } from '../../study/study.model';
import { FieldTransformerFactory } from '../transformers/field-transformer-factory';

@Injectable()
export class TagTransformer {
  constructor(private readonly fieldTransformerFactory: FieldTransformerFactory) {}

  /**
  * Transforms the tag data. Takes in the whole tag and produces the modified
  * tag data.
  */
  async transformTagData(data: any, study: Study): Promise<any> {
    const transformedData: { [property: string] : any } = { };

    const schema = study.tagSchema.dataSchema;
    const uischema = study.tagSchema.uiSchema;
    console.log(schema);
    console.log(uischema);

    if (!schema.properties) {
      return data;
    }

    for (const field in schema.properties) {
      const fieldSchema = schema.properties[field];
      const fieldUiSchema = uischema.elements.find((element) => (element as any).scope === `#/properties/${field}`);
      if (!fieldUiSchema) {
        throw new Error(`Could not find ui schema for field ${field}`);
      }

      const transformer = this.fieldTransformerFactory.getTransformer(fieldUiSchema, fieldSchema);
      const transformed = transformer ? await transformer.transformField(data[field], fieldUiSchema, fieldSchema) : data[field];
      transformedData[field] = transformed;
    }

    return transformedData;
  }
}
