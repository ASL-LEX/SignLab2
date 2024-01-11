import { JsonForms } from '@jsonforms/react';
import { Study } from '../../graphql/graphql';
import { materialRenderers } from '@jsonforms/material-renderers';
import { useState } from 'react';

export interface TagFormProps {
  study: Study;
};

export const TagForm: React.FC<TagFormProps> = (props) => {
  const [data, setData] = useState<any>({});

  return (
    <JsonForms
      schema={props.study.tagSchema.dataSchema}
      uischema={props.study.tagSchema.uiSchema}
      data={data}
      renderers={materialRenderers}
    />
  );
};
