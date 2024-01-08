import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { PartialStudyCreate } from '../types/study';
import { ErrorObject } from 'ajv';
import { useStudyExistsLazyQuery } from '../graphql/study/study';
import { useProject } from '../context/Project.context';

export interface NewStudyFormProps {
  newStudy: PartialStudyCreate | null;
  setNewStudy: Dispatch<SetStateAction<PartialStudyCreate | null>>;
}

export const NewStudyJsonForm: React.FC<NewStudyFormProps> = (props) => {
  const initialData = {
    tagsPerEntry: schema.properties.tagsPerEntry.default
  };

  const [data, setData] = useState<any>(initialData);
  const [studyExistsQuery, studyExistsResults] = useStudyExistsLazyQuery();
  const { project } = useProject();
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([]);

  // Keep track of the new study internally to check to make sure the name is
  // unique before submitting
  const [potentialNewStudy, setPotentialNewStudy] = useState<PartialStudyCreate | null>(null);

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
  label: 'Study Information',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Description',
      scope: '#/properties/description'
    },
    {
      type: 'Control',
      label: 'Instructions',
      scope: '#/properties/instructions'
    },
    {
      type: 'Control',
      label: 'Number of times each entry needs to be tagged (default 1)',
      scope: '#/properties/tagsPerEntry'
    }
  ]
};
