import { useTranslation } from 'react-i18next';
import { GetGridColDefs, TagViewTest } from '../../../types/TagColumnView';
import { Entry, Study } from '../../../graphql/graphql';
import {
  GridColDef,
  GridRenderCellParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { GetTagsQuery, useRemoveTagMutation } from '../../../graphql/tag/tag';
import { freeTextTest, getTextCols } from './FreeTextGridView.component';
import { EntryView } from '../../EntryView.component';
import { Checkbox, Button } from '@mui/material';
import { getNumericCols, numericTest } from './NumericGridView.component';
import { getSliderCols, sliderTest } from './SliderGridView.component';
import { getBoolCols, booleanTest } from './BooleanGridView.component';
import { aslLexTest, getAslLexCols } from './AslLexGridView.component';
import { getVideoCols, videoViewTest } from './VideoGridView.component';
import { useEffect, useState } from 'react';

export interface TagGridViewProps {
  study: Study;
  tags: GetTagsQuery['getTags'];
  refetchTags: () => void;
}

/**
 * The GridData represents how to get the tag into the grid view. The data type
 * itself matches the tag query except the data field is represented as key value
 * fields instead of a list of fields.
 *
 * So
 *
 * {
 *    data: [
 *      { name: "property name a", ...fields }
 *    ]
 * }
 *
 * Becomes
 *
 * {
 *   data: {
 *    "property name 1": {
 *      name: "property name 1",
 *      ...fields
 *    }
 *   }
 * }
 */
interface GridData extends Omit<GetTagsQuery['getTags'][0], 'data'> {
  data: { [property: string]: any } | null;
}

export const TagGridView: React.FC<TagGridViewProps> = ({ tags, study, refetchTags }) => {
  const { t } = useTranslation();

  const [gridData, setGridData] = useState<(GridData | null)[]>([]);

  const tagColumnViews: { tester: TagViewTest; getGridColDefs: GetGridColDefs }[] = [
    { tester: freeTextTest, getGridColDefs: getTextCols },
    { tester: numericTest, getGridColDefs: getNumericCols },
    { tester: sliderTest, getGridColDefs: getSliderCols },
    { tester: booleanTest, getGridColDefs: getBoolCols },
    { tester: aslLexTest, getGridColDefs: getAslLexCols },
    { tester: videoViewTest, getGridColDefs: getVideoCols }
  ];

  useEffect(() => {
    const newGridData: (GridData | null)[] = [];

    // This logic justs pulls out the fields from an array into an object
    for (const tag of tags) {
      const properties = {} as any;

      for (const property of Object.getOwnPropertyNames(study.tagSchema.dataSchema.properties)) {
        properties[property] = tag.data!.find((row) => row.name === property);
      }

      newGridData.push({
        ...tag,
        data: properties
      });
    }

    setGridData(newGridData);
  }, [tags]);

  const entryColumns: GridColDef[] = [
    {
      field: 'entryView',
      headerName: t('components.tagView.originalEntry'),
      width: 350,
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

  const [removeTag] = useRemoveTagMutation({
    onCompleted: () => refetchTags()
  });

  const handleRedo = (row: any) => {
    removeTag({ variables: { tag: row._id } });
  };

  const tagRedoColumns: GridColDef[] = [
    {
      field: 'redo',
      headerName: t('common.redo'),
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRedo(params.row)}
          disabled={!params.row.complete}
        >
          {t('common.redo')}
        </Button>
      )
    }
  ];

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={gridData}
      columns={entryColumns.concat(tagMetaColumns).concat(dataColunms).concat(tagRedoColumns)}
      getRowId={(row) => row._id}
      slots={{ toolbar: TagToolbar }}
    />
  );
};

const TagToolbar: React.FC = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
};

/*
const CustomExport: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Button startIcon={<Download />}> {t('components.tagView.export')} </Button>
  )
};
*/
