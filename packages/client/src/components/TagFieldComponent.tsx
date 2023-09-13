import { JsonForms } from '@jsonforms/react';
import Ajv from 'ajv';
import { Card, CardContent, Container, Typography } from '@mui/material';
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

export const TagFieldComponent: React.FC<FieldProps> = ({ field, valid, validate, index }: FieldProps) => {
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
    <Card sx={{ width: '90%', height: '15%', margin: '45px 15px -15px 10px' }}>
      <Container sx={{ display: 'flex', flexDirection: 'column', margin: ' 5px 0px -16px -20px' }}>
        <Typography sx={{ margin: '5px 0px 0px 8px', fontSize: '22px' }}>{field.data.fieldName || 'Empty'}</Typography>
        <Typography sx={{ margin: '0px 0px 7px 9px', color: 'gray', fontWeight: 'medium', fontSize: '12px' }} variant="body2">
          {field.kindDisplay}
        </Typography>
      </Container>
      <CardContent>
        <Container
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '16px'
            },
            '& .MuiFormLabel-root': {
              fontSize: '16px'
            },
            '& .MuiFormHelperText-root': {
              fontSize: '10px'
            },
            '& .MuiTypography-root': {
              fontSize: '15px'
            }
          }}
        >
          <JsonForms
            data={jsonData}
            onChange={({ data }) => handleChange(data)}
            schema={schema}
            uischema={uiSchema}
            renderers={[...materialRenderers]}
            cells={materialCells}
            ajv={ajv}
          />
        </Container>
      </CardContent>
    </Card>
  );
};
