import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { AssistantPhoto } from '@mui/icons-material';

export const BooleanProvider: React.FC<TagFieldProviderProps> = (props) => {
  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'boolean',
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
      fieldKind: 'True/False Option',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<AssistantPhoto />} name="True/False Option" onClick={handleClick} />
};
