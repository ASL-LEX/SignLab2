import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { AssistantPhoto } from '@mui/icons-material';

export const SliderProvider: React.FC<TagFieldProviderProps> = (props) => {
  const customFields = {
    minimum: { type: 'number', description: 'The minimum value of the slider' },
    maximum: { type: 'number', description: 'The maximum value of the slider' },
    stepSize: { type: 'number', description: 'The step size of the slider' }
  };

  const customUISchema = [
    {
      type: 'Control',
      scope: '#/properties/minimum'
    },
    {
      type: 'Control',
      scope: '#/properties/maximum'
    },
    {
      type: 'Control',
      scope: '#/properties/stepSize'
    }
  ];

  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'number',
        description: data.description,
        minimum: data.minimum,
        maximum: data.maximum,
        multipleOf: data.stepSize,
        default: data.minimum
      }
    };
  };

  const produceUISchema = (data: any) => {
    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`,
        options: {
          slider: true,
          showUnfocusedDescription: true
        }
      }
    ];
  };

  const handleClick = () => {
    props.handleClick({
      ...produceJSONForm(customFields, customUISchema, ['minimum', 'maximum']),
      fieldKind: 'Slider',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<AssistantPhoto />} name="Slider" onClick={handleClick} />;
};
