import { withJsonFormsControlProps } from '@jsonforms/react';
import { TextSearch } from '@bu-sail/saas-view/dist/components/TextSearch/TextSearch.component';

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
    <TextSearch
      width={300}
      lexicon={data}
      setSearchResults={(entry) => {
        handleChange(path, getAslLexCode(entry));
      }}
    />
  </>
);

export default withJsonFormsControlProps(AslLexSearchControl);
