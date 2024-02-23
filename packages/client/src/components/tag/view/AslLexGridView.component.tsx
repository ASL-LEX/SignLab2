import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE, GetGridColDefs } from '../../../types/TagColumnView';

const AslLexGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return 'hello world';
}

export const aslLexTest: TagViewTest = (uischema, _schema, _context) => {
  if (uischema.options != undefined && uischema.options.customType != undefined && uischema.options.customType == 'asl-lex') {
    return 5;
  }
  return NOT_APPLICABLE;
}

export const getAslLexCols: GetGridColDefs = (uischema, schema, property) => {
  return [{
    field: property,
    headerName: property,
    renderCell: (params) => params.row.data && <AslLexGridView data={params.row.data[property]} schema={schema} uischema={uischema} />
  }]
}
