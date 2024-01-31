import { withJsonFormsControlProps } from '@jsonforms/react';
import { TextSearch, SearchResults } from '@bu-sail/saas-view';
import { useState } from 'react';
import { LexiconEntry } from '../../graphql/graphql';

interface AslLexSearchControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

function getAslLexCode(aslLexObject: any) {
  return aslLexObject.key ? aslLexObject.key : '';
}

const width = 300;
const aslLexicon = { _id: import.meta.env.VITE_ASL_LEXICON_ID, name: import.meta.env.VITE_NAME, schema: {} };

const AslLexSearchControl = ({ handleChange, path }: AslLexSearchControlProps) => {
  const [searchResults, setSearchResults] = useState<LexiconEntry[]>([]);
  const [value, setValue] = useState<LexiconEntry | null>(null);

  return (
    <>
      <TextSearch width={300} lexicon={aslLexicon} setSearchResults={setSearchResults} />
      {searchResults.length > 0 && (
        <SearchResults
          options={searchResults}
          value={value}
          setValue={(entry) => {
            setValue(entry);
            handleChange(path, getAslLexCode(entry));
          }}
          width={width}
        />
      )}
    </>
  );
};

export default withJsonFormsControlProps(AslLexSearchControl);
