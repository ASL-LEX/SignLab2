import { TagFieldProviderProps, produceJSONForm, ProviderButton } from './TagProvider.tsx';
import { AssistantPhoto } from '@mui/icons-material';
import { Dataset } from '../../graphql/graphql';
import  { useState, useEffect } from 'react';
import { useGetDatasetsByProjectLazyQuery } from '../../graphql/dataset/dataset.ts';
import { useProject } from '../../context/Project.context.tsx';

export const VideoRecordProvider: React.FC<TagFieldProviderProps> = (props) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const { project } = useProject();
  const [getDatasets, getDatasetsResults] = useGetDatasetsByProjectLazyQuery();

  useEffect(() => {
    if (project) {
      getDatasets({ variables: { project: project._id } });
    }
  }, [project]);

  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasetsByProject);
    }
  }, [getDatasetsResults.data]);

  const customFields = {
    dataset: {
      type: 'string',
      oneOf: datasets.map((dataset) => ({ const: dataset.name, title: dataset.name })),
      description: 'The dataset to save the videos into'
    },
    minimumRequired: {
      type: 'number',
      description: 'The minimum number of videos the user needs to record, (defaults to 1)'
    },
    maximumOptional: {
      type: 'number',
      description: 'The maximum number of videos the user can record (including required, defaults to 1)'
    },
  };

  const customUISchema = [
    {
      type: 'Control',
      scope: '#/properties/dataset',
    },
    {
      type: 'Control',
      scope: '#/properties/minimumRequired',
    },
    {
      type: 'Control',
      scope: '#/properties/maximumOptional',
    },
  ];

  const produceDataSchema = (data: any) => {
    return {
      [data.fieldName]: {
        type: 'array',
        description: data.description,
        items: {
          type: 'string',
        },
        minItems: data.minimumRequired || 1,
      }
    };
  };

  const produceUISchema = (data: any) => {
    return [
      {
        type: 'Control',
        scope: `#/properties/${data.fieldName}`,
        options: {
          customType: 'video',
          dataset: datasets.find((dataset) => dataset.name === data.dataset)!._id,
          minimumRequired: data.minimumRequired || 1,
          maximumOptional: data.maximumOptional || 1,
          showUnfocusedDescription: true
        }
      }
    ];
  };

  const handleClick = () => {
    props.handleClick({
      ...produceJSONForm(customFields, customUISchema, ['dataset']),
      fieldKind: 'Video Record',
      produceDataSchema,
      produceUISchema
    });
  };

  return <ProviderButton icon={<AssistantPhoto />} name="Video Record" onClick={handleClick} />
};
