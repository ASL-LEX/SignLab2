import { withJsonFormsControlProps } from '@jsonforms/react';
import { TextSearch, SearchResults } from '@bu-sail/saas-view';
import { useState, useEffect } from 'react';
import { LexiconEntry } from '../../../graphql/graphql';
import { ControlProps } from '@jsonforms/core';

function getAslLexCode(aslLexObject: any) {
  return aslLexObject.key ? aslLexObject.key : '';
}

const width = 300;
const aslLexicon = { _id: import.meta.env.VITE_ASL_LEXICON_ID, name: import.meta.env.VITE_NAME, schema: {} };

const AslLexSearchControl: React.FC<ControlProps> = (props) => {
  const [searchResults, setSearchResults] = useState<LexiconEntry[]>([]);
  const [value, setValue] = useState<LexiconEntry | null>(null);

  useEffect(() => {
    if (!props.data) {
      setValue(null);
      setSearchResults([]);
      return;
    }
  }, [props.data]);

  return (
    <>
      <TextSearch width={300} lexicon={aslLexicon} setSearchResults={setSearchResults} />
      {searchResults.length > 0 && (
        <SearchResults
          options={searchResults}
          value={value}
          setValue={(entry) => {
            setValue(entry);
            props.handleChange(props.path, getAslLexCode(entry));
          }}
          width={width}
        />
      )}
    </>
  );
};

export default withJsonFormsControlProps(AslLexSearchControl);
