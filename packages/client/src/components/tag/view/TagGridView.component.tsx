import { useTranslation } from 'react-i18next';
import { GetGridColDefs, TagViewTest } from '../../../types/TagColumnView';
import { Study, Entry } from '../../../graphql/graphql';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { GetTagsQuery, useGetTagsQuery } from '../../../graphql/tag/tag';
import { useEffect, useState } from 'react';
import { freeTextTest, getTextCols } from './FreeTextGridView.component';
import { EntryView } from '../../EntryView.component';
import { Checkbox } from '@mui/material';
import { getNumericCols, numericTest } from './NumericGridView.component';
import { getSliderCols, sliderTest } from './SliderGridView.component';
import { getBoolCols, booleanTest } from './BooleanGridView.component';
import { aslLexTest, getAslLexCols } from './AslLexGridView.component';
import { getVideoCols, videoViewTest } from './VideoGridView.component';

export interface TagGridViewProps {
  study: Study;
}

export const TagGridView: React.FC<TagGridViewProps> = ({ study }) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<GetTagsQuery['getTags']>([]);

  const tagColumnViews: { tester: TagViewTest; getGridColDefs: GetGridColDefs }[] = [
    { tester: freeTextTest, getGridColDefs: getTextCols },
    { tester: numericTest, getGridColDefs: getNumericCols },
    { tester: sliderTest, getGridColDefs: getSliderCols },
    { tester: booleanTest, getGridColDefs: getBoolCols },
    { tester: aslLexTest, getGridColDefs: getAslLexCols },
    { tester: videoViewTest, getGridColDefs: getVideoCols }
  ];

  const getTagsResults = useGetTagsQuery({ variables: { study: study._id } });

  useEffect(() => {
    if (getTagsResults.data) {
      setTags(getTagsResults.data.getTags);
    }
  }, [getTagsResults.data]);

  const entryColumns: GridColDef[] = [
    {
      field: 'entryView',
      headerName: t('components.tagView.originalEntry'),
      width: 300,
      renderCell: (params: GridRenderCellParams) => <EntryView entry={params.row.entry as Entry} width={300} />
    }
  ];

  const tagMetaColumns: GridColDef[] = [
    {
      field: 'complete',
      headerName: t('common.complete'),
      renderCell: (params: GridRenderCellParams) => <Checkbox disabled checked={params.row.complete} />
    }
  ];

  // Generate the dynamic columns for the grid
  const dataColunms: GridColDef[] = Object.getOwnPropertyNames(study.tagSchema.dataSchema.properties)
    .map((property: string) => {
      const fieldSchema = study.tagSchema.dataSchema.properties[property];
      const fieldUiSchema = study.tagSchema.uiSchema.elements.find(
        (element: any) => element.scope === `#/properties/${property}`
      );

      if (!fieldSchema || !fieldUiSchema) {
        throw new Error(`Could not find schema for property ${property}`);
      }

      const context = { rootSchema: study.tagSchema.dataSchema, config: {} };
      const reactNode = tagColumnViews
        .filter((view) => view.tester(fieldUiSchema, fieldSchema, context))
        .sort((a, b) => b.tester(fieldUiSchema, fieldSchema, context) - a.tester(fieldUiSchema, fieldSchema, context));

      if (reactNode.length === 0) {
        throw new Error(`No matching view for property ${property}`);
      }

      return reactNode[0].getGridColDefs(fieldUiSchema, fieldSchema, property);
    })
    .flat();

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={tags}
      columns={entryColumns.concat(tagMetaColumns).concat(dataColunms)}
      getRowId={(row) => row._id}
    />
  );
};
