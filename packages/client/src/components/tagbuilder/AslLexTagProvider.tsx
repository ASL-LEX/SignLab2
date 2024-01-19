import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { Accessibility } from '@mui/icons-material';

export const AslLexFieldProvider: React.FC<TagFieldProviderProps> = (props) => {
  const customFields = {
    allowCustomLabels: { type: 'boolean' }
  };

  const customUISchema = [
    {
      type: 'Control',
      scope: '#/properties/allowCustomLabels'
    }
  ];

  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'string',
        description: data.description,
      }
    };
  };

  const produceUISchema = (data: any) => {
    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`,
        options: {
          customType: 'asl-lex',
          allowCustomLabels: data.allowCustomLabels,
          showUnfocusedDescription: true
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

  return <ProviderButton icon={<Accessibility />} name="ASL-LEX" onClick={handleClick} />
};
