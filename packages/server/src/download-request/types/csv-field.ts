import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Tag } from '../../tag/models/tag.model';

/**
 * Represents a column within a CSV. Keep track both of the header as well as how
 * to get the field value from an object.
 */
export interface CsvField {
  header: string;
  convertField: (value: Tag) => Promise<string>;
}

export type CsvFieldTest = (uischema: UISchemaElement, schema: JsonSchema) => boolean;
