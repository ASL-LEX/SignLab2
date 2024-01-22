import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { VideoLibrary } from '@mui/icons-material';

export const EmbeddedProvider: React.FC<TagFieldProviderProps> = (props) => {
  const customFields = {
    allowCustomLabels: { type: 'boolean' },
    userVideoParameters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          videoURL: {
            type: 'string'
          },
          code: {
            type: 'string'
          },
          searchTerm: {
            type: 'string'
          }
        },
        required: ['videoURL', 'code', 'searchTerm']
      }
    }
  };

  const customUISchema = [
    {
      type: 'Control',
      scope: '#/properties/allowCustomLabels'
    },
    {
      type: 'Control',
      scope: '#/properties/userVideoParameters',
      options: {
        customType: 'video-option-upload'
      }
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
    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`,
        options: {
          customType: 'video-options',
          allowCustomLabels: data.allowCustomLabels,
          userVideoParameters: data.userVideoParameters,
          showUnfocusedDescription: true
        }
      }
    ];
  };

  const handleClick = () => {
    props.handleClick({
      ...produceJSONForm(customFields, customUISchema, ['userVideoParameters']),
      fieldKind: 'List of Video Options',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<VideoLibrary />} name="List of Video Options" onClick={handleClick} />;
};
