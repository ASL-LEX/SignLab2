import { Grid, Button, Typography, Stack } from '@mui/material';
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
import { TagFormPreviewDialog } from './TagFormPreview.component';
import { TagFieldGeneratorService } from '../services/tag-field-generator.service';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { TagFieldView } from './TagField.component';
import { TagSchema } from '../graphql/graphql';

type TagPreviewInformation = {
  previewDataSchema: any;
  previewUiSchema: any;
  renderers: any;
};

export interface TagsDisplayProps {
  tagSchema: TagSchema | null;
  setTagSchema: Dispatch<SetStateAction<TagSchema | null>>;
}

export const TagsDisplay: React.FC<TagsDisplayProps> = (props) => {
  const [tagFields, setTagFields] = useState<TagField[]>([]);
  const [data, setData] = useState<TagPreviewInformation>({
    previewDataSchema: {},
    previewUiSchema: {},
    renderers: []
  });
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

  // Handling keeping track of complete tag schema
  useEffect(() => {
    if (valid.length === 0 || valid.includes(false)) {
      return;
    }
    const schema = produceJSONForm();
    props.setTagSchema({
      dataSchema: schema.dataSchema,
      uiSchema: schema.uiSchema
    });
  }, [valid, tagFields]);

  const produceJSONForm = () => {
    const dataSchema: { type: string; properties: any; required: string[] } = {
      type: 'object',
      properties: {},
      required: []
    };
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
      <Grid item xs={3}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h5">Tag Fields</Typography>
          {tagFieldOptions.map((button: any) => (
            <Button
              variant="outlined"
              key={button.name}
              startIcon={button.icon}
              onClick={() => addTagField(button.type)}
            >
              {button.name}
            </Button>
          ))}
        </Stack>

        <Button
          variant="outlined"
          onClick={openTagFormPreview}
          disabled={valid.includes(false)}
          sx={{ width: '100%', marginTop: 3 }}
        >
          Preview
        </Button>

        <TagFormPreviewDialog data={data} clicked={open} toggleModal={toggleModal} />
      </Grid>

      <Grid item xs={9} sx={{ overflow: 'auto' }}>
        <Stack direction="column" sx={{ maxHeight: 400 }} spacing={2}>
          {tagFields.length > 0 ? (
            tagFields.map((value: TagField, index: number) => (
              <Stack direction="row" key={index} spacing={1}>
                <TagFieldView field={value} valid={valid} validate={setValid} index={index} />
                <Button startIcon={<DeleteIcon />} onClick={() => removeField(index)} />
              </Stack>
            ))
          ) : (
            <Typography variant="h5">No Tags Selected</Typography>
          )}
          <br />
        </Stack>
      </Grid>
    </Grid>
  );
};
