import { JsonForms } from '@jsonforms/react';
import Ajv, { ErrorObject } from 'ajv';
import { Card, CardContent, Typography } from '@mui/material';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { useState } from 'react';
import { TagField, TagFieldFragmentSchema } from './TagProvider';

interface FieldProps {
  /** Information on the tag field being constructed */
  field: TagField;
  /** The existing fragment if it exists */
  tagFieldSchema: TagFieldFragmentSchema | null;
  /** Function to set the field fragment */
  setFieldFragment: (fragment: TagFieldFragmentSchema | null) => void;
}

export const TagFieldView: React.FC<FieldProps> = ({ field, setFieldFragment, tagFieldSchema }: FieldProps) => {
  const ajv = new Ajv({ allErrors: true, schemaId: 'id' });
  const [data, setData] = useState<any>(tagFieldSchema ? tagFieldSchema.data : {});

  const handleChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);

    // If no errors represent, make the field fragment
    if (!errors || errors.length === 0) {
      setFieldFragment({
        dataSchema: field.produceDataSchema(data),
        uiSchema: field.produceUISchema(data),
        required: data.required ? data.fieldName : null,
        data
      });
    }
    // Otherwise, set the field fragment to null
    else {
      setFieldFragment(null);
    }
  };

  return (
    <Card sx={{ width: '90%', height: '15%' }}>
      <>
        <Typography sx={{ fontSize: '22px' }}>{'Empty'}</Typography>
        <Typography sx={{ color: 'gray', fontWeight: 'medium', fontSize: '12px' }} variant="body2">
          {field.fieldKind}
        </Typography>
      </>
      <CardContent>
        <JsonForms
          data={data}
          onChange={({ data, errors }) => handleChange(data, errors)}
          schema={field.dataSchema}
          uischema={field.uiSchema}
          renderers={[...materialRenderers]}
          cells={materialCells}
          ajv={ajv}
        />
      </CardContent>
    </Card>
  );
};
