import { Grid, Button, Typography, Stack, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TagFormPreviewDialog } from './TagFormPreview.component';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { TagFieldView } from './TagField.component';
import { TagSchema } from '../../graphql/graphql';
import { AslLexFieldProvider } from './AslLexTagProvider';
import { AutocompleteProvider } from './AutocompleteProvider';
import { BooleanProvider } from './BooleanProvider';
import { EmbeddedProvider } from './EmbeddedVideoProvider';
import { TagField, TagFieldFragmentSchema } from './TagProvider';

export interface TagsDisplayProps {
  tagSchema: TagSchema | null;
  setTagSchema: Dispatch<SetStateAction<TagSchema | null>>;
}

export const TagFormBuilder: React.FC<TagsDisplayProps> = ({ tagSchema, setTagSchema }) => {
  // The different fields that make up the tag schema
  const [tagFields, setTagFields] = useState<TagField[]>([]);

  // Fragments of the final tag schema
  const [tagSchemaFragments, setTagSchemaFragments] = useState<(TagFieldFragmentSchema | null)[]>([]);

  const [open, setOpen] = useState(false);

  const addTagField = (tagField: TagField) => {
    setTagFields([...tagFields, tagField]);

    tagSchemaFragments.push(null);
    setTagSchemaFragments([...tagSchemaFragments]);
  };

  const removeField = (index: number) => {
    tagFields.splice(index, 1);
    setTagFields([...tagFields]);

    tagSchemaFragments.splice(index, 1);
    setTagSchemaFragments([...tagSchemaFragments]);
  };

  // Handle update a tag schema fragment
  const updateTagSchemaFragment = (index: number, fragment: TagFieldFragmentSchema | null) => {
    tagSchemaFragments[index] = fragment;
    setTagSchemaFragments([...tagSchemaFragments]);
  };

  // Handling keeping track of complete tag schema
  useEffect(() => {
    // If any frame is null, the tag schema is null
    if (tagSchemaFragments.length == 0 || tagSchemaFragments.some((fragment) => fragment === null)) {
      setTagSchema(null);
      return;
    }

    // Combine all the fragments into a single tag schema
    let dataProperties: any = {};
    let uiElements = [];
    for (const fragment of tagSchemaFragments) {
      dataProperties = { ...dataProperties, ...fragment!.dataSchema };
      uiElements.push(...fragment!.uiSchema);
    }

    setTagSchema({
      dataSchema: {
        type: 'object',
        properties: dataProperties,
        required: tagSchemaFragments.map((fragment) => fragment!.required).filter((required) => required !== null)
      },
      uiSchema: {
        type: 'VerticalLayout',
        elements: uiElements
      }
    });
  }, [tagSchemaFragments]);

  const openTagFormPreview = () => {
    setOpen(true);
  };

  const toggleModal = () => {
    setOpen((open) => !open);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <Stack direction="column" spacing={1} sx={{ maxWidth: 400 }}>
          <Typography variant="h5">Tag Fields</Typography>
          <AslLexFieldProvider handleClick={addTagField} />
          <AutocompleteProvider handleClick={addTagField} />
          <BooleanProvider handleClick={addTagField} />
          <EmbeddedProvider handleClick={addTagField} />
        </Stack>

        <Box sx={{ maxWidth: 400, marginTop: 3 }}>
          <Button
            variant="outlined"
            onClick={openTagFormPreview}
            disabled={tagSchemaFragments.some((fragment) => fragment === null)}
            sx={{ width: '100%' }}
          >
            Preview
          </Button>
        </Box>

        {tagSchema && <TagFormPreviewDialog schema={tagSchema} clicked={open} toggleModal={toggleModal} />}
      </Grid>

      <Grid item xs={9} sx={{ overflow: 'auto' }}>
        <Stack direction="column" sx={{ maxHeight: 400 }} spacing={2}>
          {tagFields.length > 0 ? (
            tagFields.map((value: TagField, index: number) => (
              <Stack direction="row" key={index} spacing={1}>
                <TagFieldView field={value} setFieldFragment={(fragment) => updateTagSchemaFragment(index, fragment)}  />
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
