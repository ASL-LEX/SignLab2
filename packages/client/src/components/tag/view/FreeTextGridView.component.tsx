import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from "../../../types/TagColumnView";
import { materialAnyOfStringOrEnumControlTester } from "@jsonforms/material-renderers";

/** Visualize basic text data in a grid view */
const FreeTextGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
}

export const freeTextTest: TagViewTest = (uischema, schema, context) => {
  if (materialAnyOfStringOrEnumControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 1;
  }
  return NOT_APPLICABLE;
}

export const getTextCols: GetGridColDefs = (uischema, schema, property) => {
  return [{
    field: property,
    headerName: property,
    renderCell: (params) => params.row.data && <FreeTextGridView data={params.row.data[property]} schema={schema} uischema={uischema} />
  }]
}
