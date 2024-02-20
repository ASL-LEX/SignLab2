import { useTranslation } from 'react-i18next';
import { TagColumnView, TagColumnViewProps, TagViewTest } from '../../../types/TagColumnView';
import { Study } from '../../../graphql/graphql';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { GetTagsQuery, useGetTagsQuery } from '../../../graphql/tag/tag';
import { useEffect, useState } from 'react';
import { FreeTextGridView, freeTextTest} from './FreeTextGridView.component';

export interface TagGridViewProps {
  study: Study;
}

export const TagGridView: React.FC<TagGridViewProps> = ({ study }) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<GetTagsQuery['getTags']>([]);

  const tagColumnViews: { tester: TagViewTest, view: TagColumnView }[] = [
    { tester: freeTextTest, view: { component: FreeTextGridView } }
  ];

  const getTagsResults = useGetTagsQuery({ variables: { study: study._id } });

  useEffect(() => {
    if (getTagsResults.data) {
      setTags(getTagsResults.data.getTags);
    }
  }, [getTagsResults.data]);

  // Generate the dynamic columns for the grid
  const columns: GridColDef[] = Object.getOwnPropertyNames(study.tagSchema.dataSchema.properties).map((property: string) => {
    const fieldSchema = study.tagSchema.dataSchema.properties[property];
    const fieldUiSchema = study.tagSchema.uiSchema.elements.find((element: any) => element.scope === `#/properties/${property}`);

    if (!fieldSchema || !fieldUiSchema) {
      throw new Error(`Could not find schema for property ${property}`);
    }

    const context = { rootSchema: study.tagSchema.dataSchema, config: {} };
    const reactNode = tagColumnViews
      .filter((view) => view.tester(fieldUiSchema, fieldSchema, context))
      .sort((a, b) => a.tester(fieldUiSchema, fieldSchema, context) - b.tester(fieldUiSchema, fieldSchema, context));

    if (reactNode.length === 0) {
      throw new Error(`No matching view for property ${property}`);
    }

    const view: React.FC<TagColumnViewProps> = reactNode[0].view.component;

    return {
      field: property,
      headerName: fieldUiSchema.title || property,
      editable: false,
      renderCell: (params: GridRenderCellParams) => view({ data: params.row.data[property], schema: fieldSchema, uischema: fieldUiSchema })
    };
  });

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={tags}
      columns={columns}
      getRowId={(row) => row._id}
    />
  );
};
