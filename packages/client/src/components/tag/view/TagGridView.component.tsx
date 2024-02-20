import { useTranslation } from 'react-i18next';
import { TagColumnView, TagColumnViewProps, TagViewTest } from '../../../types/TagColumnView';
import { Study } from '../../../graphql/graphql';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {DataGrid} from '@mui/x-data-grid';

export interface TagGridViewProps {
  study: Study;
}

export const TagGridView: React.FC<TagGridViewProps> = ({ study }) => {
  const { t } = useTranslation();

  const tagColumnViews: { tester: TagViewTest, view: TagColumnView }[] = [

  ];

  const columns: GridColDef[] = study.tagSchema.dataSchema.properties.map((property: string) => {
    const fieldSchema = study.tagSchema.dataSchema.properties[property];
    const fieldUiSchema = study.tagSchema.uiSchema.elements.find((element: any) => element.scope === `#/properties/${property}`);

    if (!fieldSchema || !fieldUiSchema) {
      throw new Error(`Could not find schema for property ${property}`);
    }

    const reactNode = tagColumnViews
      .filter((view) => view.tester(fieldUiSchema, fieldSchema))
      .sort((a, b) => a.tester(fieldUiSchema, fieldSchema) - b.tester(fieldUiSchema, fieldSchema));

    if (reactNode.length === 0) {
      throw new Error(`No matching view for property ${property}`);
    }

    const view: React.FC<TagColumnViewProps> = reactNode[0].view.component;

    return {
      field: property,
      headerName: fieldUiSchema.title || property,
      editable: false,
      renderCell: (params: GridRenderCellParams) => view({ data: params.row[property], schema: fieldSchema, uischema: fieldUiSchema })
    };
  });

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={[]}
      columns={columns}
      getRowId={(row) => row._id}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10
          }
        }
      }}
    />
  );
};
