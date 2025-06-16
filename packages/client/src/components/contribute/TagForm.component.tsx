import { JsonForms } from '@jsonforms/react';
import { Study } from '../../graphql/graphql';
import { materialRenderers } from '@jsonforms/material-renderers';
import { SetStateAction, useState, Dispatch, useEffect } from 'react';
import { Box, Stack, Button } from '@mui/material';
import { ErrorObject } from 'ajv';
import AslLexSearchControl from '../tag/asllex/AslLexSearchControl';
import AslLexSearchControlTester from '../tag/asllex/aslLexSearchControlTester';
import VideoRecordField, { videoFieldTester } from '../tag/videorecord/VideoRecordField.component';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { useTranslation } from 'react-i18next';

export interface TagFormProps {
  study: Study;
  setTagData: Dispatch<SetStateAction<any>>;
}

export const TagForm: React.FC<TagFormProps> = (props) => {
  const [data, setData] = useState<any>();
  const [dataValid, setDataValid] = useState<boolean>(false);
  const { t } = useTranslation();

  // Controls if a clear button should be present
  const [hasClearButton, setHasClearButton] = useState<boolean>(false);

  useEffect(() => {
    // If the study config is not present, by default have a clear button
    if (!props.study.studyConfig) {
      setHasClearButton(true);
      return;
    }

    // If the "disableClear" field isn't present, default have a clear button
    if (props.study.studyConfig.disableClear === undefined || props.study.studyConfig.disableClear === null) {
      setHasClearButton(true);
      return;
    }

    // Otherwise use the field
    setHasClearButton(!props.study.studyConfig.disableClear);
  }, [props.study]);

  const handleFormChange = (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);

    // No errors, data could be submitted
    if (!errors || errors.length === 0) {
      setDataValid(true);
    } else {
      setDataValid(false);
    }
  };

  const handleSubmit = () => {
    // Ideally should not get here
    if (!dataValid) {
      return;
    }
    props.setTagData(data);

    // Get ready for the next tag
    handleClear();
  };

  const handleClear = () => {
    setData({});
  };

  const renderers: JsonFormsRendererRegistryEntry[] = [
    ...materialRenderers,
    { tester: videoFieldTester, renderer: VideoRecordField },
    { tester: AslLexSearchControlTester, renderer: AslLexSearchControl }
  ];

  // Support for using the enter key for submission
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    // Listen for spaces
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [props, data, dataValid]);

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Stack direction="column" spacing={2}>
        <JsonForms
          schema={props.study.tagSchema.dataSchema}
          uischema={props.study.tagSchema.uiSchema}
          data={data}
          onChange={({ data, errors }) => handleFormChange(data, errors)}
          renderers={renderers}
        />
        <Stack direction="row">
          <Button variant="outlined" onClick={handleSubmit} disabled={!dataValid}>
            {t('common.submit')}
          </Button>

          {hasClearButton && (
            <Button variant="outlined" onClick={handleClear}>
              {t('common.clear')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
