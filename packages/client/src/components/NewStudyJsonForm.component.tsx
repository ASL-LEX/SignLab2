import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { PartialStudyCreate } from '../types/study';
import { ErrorObject } from 'ajv';
import { useStudyExistsLazyQuery } from '../graphql/study/study';
import { useProject } from '../context/Project.context';
import { useTranslation } from 'react-i18next';

export interface NewStudyFormProps {
  newStudy: PartialStudyCreate | null;
  setNewStudy: Dispatch<SetStateAction<PartialStudyCreate | null>>;
}

export const NewStudyJsonForm: React.FC<NewStudyFormProps> = (props) => {
  const [studyExistsQuery, studyExistsResults] = useStudyExistsLazyQuery();
  const { project } = useProject();
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([]);

  // Keep track of the new study internally to check to make sure the name is
  // unique before submitting
  const [potentialNewStudy, setPotentialNewStudy] = useState<PartialStudyCreate | null>(null);
  const { t } = useTranslation();

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z 0-9]*$'
      },
      description: {
        type: 'string'
      },
      instructions: {
        type: 'string'
      },
      tagsPerEntry: {
        type: 'number',
        default: 1
      }
    },
    required: ['name', 'description', 'instructions', 'tagsPerEntry']
  };

  const uischema = {
    type: 'Group',
    label: t('components.newStudy.formTitle'),
    elements: [
      {
        type: 'Control',
        label: t('common.name'),
        scope: '#/properties/name'
      },
      {
        type: 'Control',
        label: t('common.description'),
        scope: '#/properties/description'
      },
      {
        type: 'Control',
        label: t('common.instruction'),
        scope: '#/properties/instructions'
      },
      {
        type: 'Control',
        label: t('components.newStudy.tagsDescription'),
        scope: '#/properties/tagsPerEntry'
      }
    ]
  };

  const initialData = {
    tagsPerEntry: schema.properties.tagsPerEntry.default
  };
  const [data, setData] = useState<any>(initialData);

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);
    if (!errors || errors.length === 0) {
      // No errors in the format of the data, check if the study name is unique
      setPotentialNewStudy({ ...data });
      studyExistsQuery({ variables: { name: data.name, project: project!._id } });
    } else {
      setPotentialNewStudy(null);
    }
  };

  useEffect(() => {
    // If the study exists, notify the user of the error, otherwise the
    // study is valid
    if (studyExistsResults.data?.studyExists) {
      setAdditionalErrors([
        {
          instancePath: '/name',
          keyword: 'uniqueStudyName',
          message: 'A study with this name already exists',
          schemaPath: '#/properties/name/name',
          params: { keyword: 'uniqueStudyName' }
        }
      ]);
      props.setNewStudy(null);
    } else {
      setAdditionalErrors([]);
      props.setNewStudy(potentialNewStudy);
    }
  }, [studyExistsResults.data]);

  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      renderers={materialRenderers}
      cells={materialCells}
      onChange={({ data, errors }) => handleChange(data, errors)}
      additionalErrors={additionalErrors}
    />
  );
};
