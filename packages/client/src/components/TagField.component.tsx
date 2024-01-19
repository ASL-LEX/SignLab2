import { JsonForms } from '@jsonforms/react';
import Ajv from 'ajv';
import { Card, CardContent, Typography } from '@mui/material';
import { TagField } from '../models/TagField';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { useEffect, useState } from 'react';
import { JsonSchema } from '@jsonforms/core';

interface FieldProps {
  field: TagField;
  valid: boolean[];
  validate: React.Dispatch<React.SetStateAction<boolean[]>>;
  index: number;
}

export const TagFieldView: React.FC<FieldProps> = ({ field, valid, validate, index }: FieldProps) => {
  const [jsonData, setJsonData] = useState({});
  const [schema, setSchema] = useState<JsonSchema>({});
  const [uiSchema, setUiSchema] = useState({ type: 'object' });
  const ajv = new Ajv({ allErrors: true, schemaId: 'id' });

  useEffect(() => {
    field.getDataSchema().then((value) => setSchema(value));
    setUiSchema(field.getUISchema());
  }, [field]);

  const handleChange = (data: any) => {
    field.setData(data);
    setJsonData(data);
    if (ajv.validate(schema, data)) {
      valid[index] = true;
      validate([...valid]);
    }
  };

  return (
    <Card sx={{ width: '90%', height: '15%' }}>
      <>
        <Typography sx={{ fontSize: '22px' }}>{field.data.fieldName || 'Empty'}</Typography>
        <Typography
          sx={{ color: 'gray', fontWeight: 'medium', fontSize: '12px' }}
          variant="body2"
        >
          {field.kindDisplay}
        </Typography>
      </>
      <CardContent>
        <JsonForms
          data={jsonData}
          onChange={({ data }) => handleChange(data)}
          schema={schema}
          uischema={uiSchema}
          renderers={[...materialRenderers]}
          cells={materialCells}
          ajv={ajv}
        />
      </CardContent>
    </Card>
  );
};
