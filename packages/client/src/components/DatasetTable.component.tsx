import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Dataset, Entry } from '../graphql/graphql';
import { useEntryForDatasetQuery } from '../graphql/entry';
import { EntryView } from './EntryView.component';

export interface DatasetTableProps {
  dataset: Dataset;
}

export const DatasetTable: React.FC<DatasetTableProps> = (props) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const entryForDatasetResult = useEntryForDatasetQuery({ variables: { dataset: props.dataset._id  } });

  useEffect(() => {
    console.log(entryForDatasetResult.error);
    if (entryForDatasetResult.data) {
      console.log(props.dataset);
      setEntries(entryForDatasetResult.data.entryForDataset);
    }
  }, [entryForDatasetResult.data, entryForDatasetResult.error]);

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={entries}
      columns={defaultColumns}
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
    editable: false,
  }
];
