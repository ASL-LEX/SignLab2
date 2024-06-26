import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { TokenPayload } from '../../jwt/token.dto';
import { TagField } from '../models/tag-field.model';
import { Tag } from '../models/tag.model';

/**
 * A field transformer handles converting and operating on fields of a tag.
 * It handles adding in additional information, update intermediate data,
 * and ensuring that the data meets any additional formatting requirements.
 */
export interface FieldTransformer {
  transformField(
    tag: Tag,
    data: any,
    uischema: UISchemaElement,
    schema: JsonSchema,
    user: TokenPayload,
    property: string
  ): Promise<TagField>;
}

/**
 * Tests to see if a given field should be transformed. Each `FieldTransformer`
 * has a cooresponding `FieldTransformerTest` that determines if the field
 * should be transformed.
 *
 * The rank is used to determine if one transformer should be used over another.
 * The larger the rank, the higher the priority.
 *
 * This is similar to the `RankedTester` interface in `@jsonforms/core`.
 */
export type FieldTransformerTest = (uischema: UISchemaElement, schema: JsonSchema) => number;
/** Number returned when a transformer does not apply to a given field */
export const NOT_APPLICABLE = -1;
