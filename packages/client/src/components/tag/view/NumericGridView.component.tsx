import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from "../../../types/TagColumnView";
import { materialNumberControlTester } from "@jsonforms/material-renderers";

/** Visualize basic text data in a grid view */
const NumericGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
}

export const numericTest: TagViewTest = (uischema, schema, context) => {
  if (materialNumberControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 2;
  }
  return NOT_APPLICABLE;
}

export const getNumericCols: GetGridColDefs = (uischema, schema, property) => {
  return [{
    field: property,
    headerName: property,
    renderCell: (params) => params.row.data && <NumericGridView data={params.row.data[property]} schema={schema} uischema={uischema} />
  }]
}
