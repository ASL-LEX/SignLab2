import { Search } from '@bu-sail/saas-view';
import { withJsonFormsControlProps } from '@jsonforms/react';

interface AslLexSearchControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

function getAslLexCode(aslLexObject: any) {
  return aslLexObject.key ? aslLexObject.key : '';
}

const AslLexSearchControl = ({ data, handleChange, path }: AslLexSearchControlProps) => (
  <>
    <Search
      width={300}
      value={data}
      setValue={(entry) => {
        handleChange(path, getAslLexCode(entry));
      }}
    />
  </>
);

export default withJsonFormsControlProps(AslLexSearchControl);
