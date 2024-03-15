import { DataGrid, GridColDef, GridRowId, GridActionsCellItem } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Dataset, Entry } from '../graphql/graphql';
import { useEntryForDatasetLazyQuery } from '../graphql/entry/entry';
import { EntryView } from './EntryView.component';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../context/Snackbar.context';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useDeleteEntryMutation } from '../graphql/entry/entry';
import { useConfirmation } from '../context/Confirmation.context';

export interface DatasetTableProps {
  dataset: Dataset;
  additionalColumns?: GridColDef[];
  supportEntryDelete?: boolean;
}

export const DatasetTable: React.FC<DatasetTableProps> = (props) => {
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();
  const [deleteEntryMutation] = useDeleteEntryMutation();
  const confirmation = useConfirmation();
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

  const defaultColumns: GridColDef[] = [
    {
      field: 'view',
      headerName: t('common.view'),
      width: 350,
      renderCell: (params) => <EntryView entry={params.row as Entry} width={300} />
    },
    {
      field: 'entryID',
      headerName: t('common.entryId'),
      width: 150,
      editable: false
    }
  ];

  const handleMultiSelectDelete = () => {
    confirmation.pushConfirmationRequest({
      title: t('components.datasetcontrol.deleteEntries'),
      message: `${t('components.datasetControl.deleteMultipleEntries')}:${selectedRows.length}`,
      onConfirm: async () => {
        await Promise.all(selectedRows.map((id) => {
          return deleteEntryMutation({ variables: { entry: id.toString( )} });
        }))
      },
      onCancel: () => {}
    });
  };

  const handleDelete = async (id: GridRowId) => {
    // Execute delete mutation
    confirmation.pushConfirmationRequest({
      title: t('components.datasetControl.deleteEntry'),
      message: t('components.datasetControl.deleteDescription'),
      onConfirm: async () => {
        const res = await deleteEntryMutation({ variables: { entry: id.toString() } });
        if (res.errors) {
          //TODO show error with snackbar
        } else if (res.data) {
          // TODO: Force rerendering
        }
      },
      onCancel: () => {}
    });
  };

  const deleteColumn: GridColDef = {
    field: 'delete',
    type: 'actions',
    headerName: t('common.delete'),
    width: 120,
    maxWidth: 120,
    cellClassName: 'delete',
    renderHeader: () => {
      return <IconButton onClick={() => handleMultiSelectDelete()}><Delete color={'error'}/></IconButton>;
    },
    getActions: (params) => {
      return [
        <GridActionsCellItem
          icon={<Delete color={'error'} />}
          label={t('common.delete')}
          onClick={() => handleDelete(params.id)}
        />
      ];
    }
  };

  const [entries, setEntries] = useState<Entry[]>([]);
  const columns = [...defaultColumns, ...(props.additionalColumns ?? [])];
  if (props.supportEntryDelete) {
    columns.push(deleteColumn);
  }

  const [entryForDataset, entryForDatasetResult] = useEntryForDatasetLazyQuery();

  useEffect(() => {
    entryForDataset({ variables: { dataset: props.dataset._id }, fetchPolicy: 'network-only' });
  }, [props.dataset]);

  // TODO: Add in logic to re-fetch data when the presigned URL expires
  useEffect(() => {
    if (entryForDatasetResult.data) {
      setEntries(entryForDatasetResult.data.entryForDataset);
    } else if (entryForDatasetResult.error) {
      pushSnackbarMessage(t('errors.entryQuery'), 'error');
      console.error(entryForDatasetResult.error);
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
      onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
      rowSelectionModel={selectedRows}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
};
