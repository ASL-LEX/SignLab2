import { useEffect, useState } from 'react';
import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { Accessibility } from '@mui/icons-material';
import { Lexicon } from '../../graphql/graphql.ts';
import { useLexFindAllQuery } from '../../graphql/lex.ts';

export const AslLexFieldProvider: React.FC<TagFieldProviderProps> = (props) => {
  const [lexicons, setLexicons] = useState<Lexicon[]>([]);
  const lexiconQueryResults = useLexFindAllQuery();

  useEffect(() => {
    if (!lexiconQueryResults.data) {
      return;
    }
    setLexicons(lexiconQueryResults.data?.lexFindAll);
  }, [lexiconQueryResults.data]);

  const customFields = {
    lexicon: { type: 'string', enum: lexicons.map(lexicon => lexicon.name) },
    allowCustomLabels: { type: 'boolean' }
  };

  const customUISchema = [
    {
      type: 'Control',
      scope: '#/properties/lexicon'
    },
    {
      type: 'Control',
      scope: '#/properties/allowCustomLabels'
    }
  ];

  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'string',
        description: data.description
      }
    };
  };

  const produceUISchema = (data: any) => {
    const lexicon = lexicons.find((lexicon) => lexicon.name == data.lexicon);
    if (!lexicon) {
      throw new Error(`Could not find lexicon with name ${data.lexicon}`);
    }

    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`,
        options: {
          customType: 'asl-lex',
          allowCustomLabels: data.allowCustomLabels,
          showUnfocusedDescription: true,
          lexicon: { _id: lexicon._id, name: lexicon.name }
        }
      }
    ];
  };

  const handleClick = () => {
    props.handleClick({
      ...produceJSONForm(customFields, customUISchema, []),
      fieldKind: 'ASL-LEX',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<Accessibility />} name="ASL-LEX" onClick={handleClick} />;
};
