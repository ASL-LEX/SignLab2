import { JsonSchema, TesterContext, UISchemaElement } from '@jsonforms/core';
import { GridColDef } from '@mui/x-data-grid';

export interface TagColumnViewProps {
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
}

/**
 * Represents the view of a tag in a column format. Handles determining if
 * the given view is applicable and applying the view to the given data.
 */
export type GetGridColDefs = (uischema: UISchemaElement, schema: JsonSchema, property: string) => GridColDef[];

/**
 * Test to see if a given field can be transformed into a tag column view.
 */
export type TagViewTest = (uischema: UISchemaElement, schema: JsonSchema, context: TesterContext) => number;
export const NOT_APPLICABLE = -1;
