import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Dataset, Entry } from '../graphql/graphql';
import { useDeleteEntryMutation, useEntryForDatasetQuery } from '../graphql/entry';
import { EntryView } from './EntryView.component';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useConfirmation } from '../context/Confirmation.context';

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
    },
    {
      field: 'delete',
      type: 'actions',
      headerName: 'Delete',
      width: 120,
      maxWidth: 120,
      cellClassName: 'delete',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon color={'error'} />}
            label="Delete"
            onClick={() => handleDelete(params.id)}
          />
        ];
      }
    }
  ];

  const [entries, setEntries] = useState<Entry[]>([]);
  const columns = [...defaultColumns, ...(props.additionalColumns ?? [])];

  const entryForDatasetResult = useEntryForDatasetQuery({ variables: { dataset: props.dataset._id } });
  const [deleteEntryMutation] = useDeleteEntryMutation();

  const confirmation = useConfirmation();

  // TODO: Add in logic to re-fetch data when the presigned URL expires
  useEffect(() => {
    if (entryForDatasetResult.data) {
      setEntries(entryForDatasetResult.data.entryForDataset);
    }
  }, [entryForDatasetResult.data]);

  const handleDelete = async (id: GridRowId) => {
    // Execute delete mutation
    confirmation.pushConfirmationRequest({
      title: 'Delete Entry',
      message: 'Are you sure you want to delete this project? Doing so will delete all associated tags',
      onConfirm: async () => {
        const res = await deleteEntryMutation({ variables: { entryId: id.toString() } });        
        if (res.errors) {
          //TODO show error owith snackbar
        } else if (res.data) {
          setEntries([ ...entries.filter((item) => item._id != id.toString()) ]);
        }
      },
      onCancel: () => {}
    });
  };

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
