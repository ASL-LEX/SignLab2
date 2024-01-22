import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { AssistantPhoto } from '@mui/icons-material';

export const FreeTextProvider: React.FC<TagFieldProviderProps> = (props) => {
  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'string',
        description: data.description
      }
    };
  };

  const produceUISchema = (data: any) => {
    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`
      }
    ];
  };

  const handleClick = () => {
    props.handleClick({
      ...produceJSONForm({}, [], []),
      fieldKind: 'Free Text',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<AssistantPhoto />} name="Free Text Option" onClick={handleClick} />;
};
