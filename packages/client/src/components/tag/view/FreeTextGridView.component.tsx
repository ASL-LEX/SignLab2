import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE } from "../../../types/TagColumnView";
import { materialAnyOfStringOrEnumControlTester } from "@jsonforms/material-renderers";

/** Visualize basic text data in a grid view */
export const FreeTextGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
}

export const freeTextTest: TagViewTest = (uischema, schema, context) => {
  if (materialAnyOfStringOrEnumControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 1;
  }
  return NOT_APPLICABLE;
}
