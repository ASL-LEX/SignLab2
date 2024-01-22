import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { AssistantPhoto } from '@mui/icons-material';

export const NumericProvider: React.FC<TagFieldProviderProps> = (props) => {
  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'number',
        description: data.description,
      }
    };
  };

  const produceUISchema = (data: any) => {
    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`,
      }
    ];
  };

  const handleClick = () => {
    props.handleClick({
      ...produceJSONForm({}, [], []),
      fieldKind: 'Numeric',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<AssistantPhoto />} name="Numeric" onClick={handleClick} />
};
