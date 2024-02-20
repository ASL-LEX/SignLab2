import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface TagColumnViewProps {
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
}

/**
 * Represents the view of a tag in a column format. Handles determining if
 * the given view is applicable and applying the view to the given data.
 */
export interface TagColumnView {
  component: React.FC<TagColumnViewProps>;
}

/**
 * Test to see if a given field can be transformed into a tag column view.
 */
export type TagViewTest = (uischema: UISchemaElement, schema: JsonSchema) => number;
export const NOT_APPLICABLE = -1;
