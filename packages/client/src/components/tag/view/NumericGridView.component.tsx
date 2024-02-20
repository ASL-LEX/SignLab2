import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE } from "../../../types/TagColumnView";
import { materialNumberControlTester } from "@jsonforms/material-renderers";

/** Visualize basic text data in a grid view */
export const NumericGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
}

export const numericTest: TagViewTest = (uischema, schema, context) => {
  if (materialNumberControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 1;
  }
  return NOT_APPLICABLE;
}
