import { useGetDatasetsQuery, useGetDatasetDownloadsLazyQuery } from '../../graphql/dataset/dataset';
import { useEffect, useState } from 'react';
import { Dataset, DatasetDownloadRequest, DownloadStatus } from '../../graphql/graphql';
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Download, DownloadDone, HourglassTop } from '@mui/icons-material';


export const DatasetDownloads: React.FC = () => {
  const getDatasetResult = useGetDatasetsQuery();
  const [getDownloadsQuery, getDownloadsResults] = useGetDatasetDownloadsLazyQuery();

  // Selection of the available datasets
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  // The cooresponding download requests
  const [downloadRequest, setDownloadRequests] = useState<DatasetDownloadRequest[]>([]);

  // Listen for changes in the get dataset result
  useEffect(() => {
    if (getDatasetResult.data) {
      setDatasets(getDatasetResult.data.getDatasets);
    }
  }, [getDatasetResult.data]);

  // Listen for changes in the selected dataset
  useEffect(() => {
    if (selectedDataset) {
      getDownloadsQuery({ variables: { dataset: selectedDataset._id } });
    }
  }, [selectedDataset]);

  // Listen for changes in the list of download results
  useEffect(() => {
    if (getDownloadsResults.data) {
      setDownloadRequests(getDownloadsResults.data.getDatasetDownloads);
    }
  }, [getDownloadsResults.data]);

  const datasetColumns: GridColDef[] = [
    {
      field: 'datasetName',
      headerName: 'Dataset',
      width: 200,
      valueGetter: (params) => params.row.dataset.name
    },
    {
      field: 'date',
      width: 200,
      headerName: 'Request Date',
    },
    {
      field: 'status',
      width: 200,
      headerName: 'Status',
      renderCell: (params) => params.value && <StatusView status={params.value} />
    },
    {
      field: 'entryZip',
      width: 200,
      headerName: 'Entry Download',
      renderCell: (params) => params.value && <IconButton href={params.value}><Download /></IconButton>
    }
  ];

  return (
    <>
      <FormControl>
        <InputLabel>Dataset Select</InputLabel>
        <Select
          value={selectedDataset || ''}
          onChange={(event) => setSelectedDataset(event.target.value as Dataset)}
          sx={{ minWidth: 300 }}
        >
          {datasets.map(dataset =>
            <MenuItem value={dataset as any} key={dataset._id}>{dataset.name}</MenuItem>
          )}
        </Select>
      </FormControl>
      {selectedDataset && (
        <DataGrid
          rows={downloadRequest}
          columns={datasetColumns}
          getRowId={(row) => row._id}
        />
      )}
    </>
  );
};

interface StatusViewProps {
  status: DownloadStatus;
}

const StatusView: React.FC<StatusViewProps> = ({ status }) => {
  switch(status) {
    case DownloadStatus.Ready:
      return <DownloadDone />
    case DownloadStatus.InProgress:
      return <HourglassTop />
  }
};
