import { Box, Grid, Button, Container, Typography } from '@mui/material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import BarChartIcon from '@mui/icons-material/BarChart';
import TuneIcon from '@mui/icons-material/Tune';
import VideocamIcon from '@mui/icons-material/Videocam';
import DeleteIcon from '@mui/icons-material/Delete';
import { materialRenderers } from '@jsonforms/material-renderers';
import { TagField, TagFieldType } from '../models/TagField';
import { TagFormPreviewDialog } from './TagFormPreview';
import { TagFieldGeneratorService } from '../services/tag-field-generator.service';
import { useState } from 'react';
import { TagFieldComponent } from './TagFieldComponent';

type TagPreviewInformation = {
  previewDataSchema: any;
  previewUiSchema: any;
  renderers: any;
};

export const TagsDisplay: React.FC = () => {
  const [tagFields, setTagFields] = useState<TagField[]>([]);
  const [data, setData] = useState<TagPreviewInformation>({ previewDataSchema: {}, previewUiSchema: {}, renderers: [] });
  const [valid, setValid] = useState<boolean[]>([]);
  const [open, setOpen] = useState(false);
  const renderers = [...materialRenderers];

  const addTagField = (tagFieldType: TagFieldType) => {
    const field = TagFieldGeneratorService(tagFieldType);
    setTagFields([...tagFields, field]);
    setValid([...valid, false]);
  };

  const removeField = (index: number) => {
    tagFields.splice(index, 1);
    setTagFields([...tagFields]);
    valid.splice(index, 1);
    setValid([...valid]);
  };

  const produceJSONForm = () => {
    const dataSchema: { type: string; properties: any; required: string[] } = { type: 'object', properties: {}, required: [] };
    const uiSchema: { type: string; elements: any[] } = { type: 'VerticalLayout', elements: [] };

    for (const tagField of tagFields) {
      dataSchema.properties = {
        ...dataSchema.properties,
        ...tagField.asDataProperty()
      };
      if (tagField.isRequired()) {
        dataSchema.required.push(tagField.getFieldName());
      }
      uiSchema.elements = [...uiSchema.elements, ...tagField.asUIProperty()];
    }

    return { dataSchema: dataSchema, uiSchema: uiSchema };
  };

  const openTagFormPreview = () => {
    const jsonForms = produceJSONForm();
    const data: TagPreviewInformation = {
      previewDataSchema: jsonForms.dataSchema,
      previewUiSchema: jsonForms.uiSchema,
      renderers: renderers
    };
    setData(data);
    setOpen(true);
  };

  const toggleModal = () => {
    setOpen((open) => !open);
  };

  const tagFieldOptions = [
    { name: 'ASL-LEX Sign', icon: <AccessibilityIcon />, type: TagFieldType.AslLex },
    { name: 'Categorical', icon: <TextFormatIcon />, type: TagFieldType.AutoComplete },
    { name: 'True/False Option', icon: <AssistantPhotoIcon />, type: TagFieldType.BooleanOption },
    { name: 'Video Option', icon: <VideoLibraryIcon />, type: TagFieldType.EmbeddedVideoOption },
    { name: 'Free Text', icon: <TextFieldsIcon />, type: TagFieldType.FreeText },
    { name: 'Numeric', icon: <BarChartIcon />, type: TagFieldType.Numeric },
    { name: 'Slider', icon: <TuneIcon />, type: TagFieldType.Slider },
    { name: 'Record Video', icon: <VideocamIcon />, type: TagFieldType.VideoRecord }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={3} sx={{ margin: '0px 40px 10px -40px', display: 'table-row' }}>
        <Container sx={{ display: 'flex', maxWidth: '100%', flexDirection: 'column', marginRight: '50px' }}>
          <Typography variant="h5">Tag Fields</Typography>
          {tagFieldOptions.map((button: any) => (
            <Button
              variant="outlined"
              color="secondary"
              key={button.name}
              sx={{ color: 'black', fontSize: '14px', width: '12rem', marginBottom: '6px' }}
              startIcon={button.icon}
              onClick={() => addTagField(button.type)}
            >
              {button.name}
            </Button>
          ))}
          <Button variant="outlined" sx={{ marginTop: '5%', width: '12rem' }} onClick={openTagFormPreview} disabled={valid.includes(false)}>
            Preview
          </Button>
        </Container>

        <TagFormPreviewDialog data={data} clicked={open} toggleModal={toggleModal} />
      </Grid>
      <Grid item xs={9} sx={{ overflow: 'auto' }}>
        <Box sx={{ height: 400, textAlign: 'center' }}>
          {tagFields.length > 0 ? (
            tagFields.map((value: TagField, index: number) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TagFieldComponent field={value} valid={valid} validate={setValid} index={index} />
                <Button size="large" sx={{ marginTop: '45px' }} startIcon={<DeleteIcon />} onClick={() => removeField(index)} />
              </Box>
            ))
          ) : (
            <Box>No Tags Selected</Box>
          )}
          <br />
        </Box>
      </Grid>
    </Grid>
  );
};
