import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Dataset, Entry } from '../graphql/graphql';
import { useEntryForDatasetLazyQuery } from '../graphql/entry/entry';
import { EntryView } from './EntryView.component';

export interface DatasetTableProps {
  dataset: Dataset;
  additionalColumns?: GridColDef[];
}

export const DatasetTable: React.FC<DatasetTableProps> = (props) => {
  const defaultColumns: GridColDef[] = [
    {
      field: 'view',
      headerName: 'View',
      width: 300,
      renderCell: (params) => <EntryView entry={params.row as Entry} width={300} />
    },
    {
      field: 'entryID',
      headerName: 'Entry ID',
      width: 150,
      editable: false
    }
  ];

  const [entries, setEntries] = useState<Entry[]>([]);
  const columns = [...defaultColumns, ...(props.additionalColumns ?? [])];

  const [entryForDataset, entryForDatasetResult] = useEntryForDatasetLazyQuery();

  useEffect(() => {
    entryForDataset({ variables: { dataset: props.dataset._id }, fetchPolicy: 'network-only' });
  }, [props.dataset]);

  // TODO: Add in logic to re-fetch data when the presigned URL expires
  useEffect(() => {
    if (entryForDatasetResult.data) {
      setEntries(entryForDatasetResult.data.entryForDataset);
    }
  }, [entryForDatasetResult]);

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={entries}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5
          }
        }
      }}
      getRowId={(row) => row._id}
      pageSizeOptions={[5, 10, 15]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
};
