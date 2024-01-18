import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Dataset } from '../../graphql/graphql';
import { DatasetsView } from '../../components/DatasetsView.component';
import { useGetDatasetsByProjectQuery } from '../../graphql/dataset/dataset';
import { useProject } from '../../context/Project.context';
import ToggleEntryEnabled from '../../components/ToggleEntryEnabled.component';

export const EntryControls: React.FC = () => {
  const { project } = useProject();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsByProjectResults = useGetDatasetsByProjectQuery({
    variables: {
      project: project ? project._id : ''
    }
  });

  useEffect(() => {
    if (getDatasetsByProjectResults.data) {
      setDatasets(getDatasetsByProjectResults.data.getDatasetsByProject);
    }
  }, [getDatasetsByProjectResults.data]);

  const additionalColumns: GridColDef[] = [
    {
      field: 'enabled',
      type: 'actions',
      headerName: 'Enable',
      width: 120,
      maxWidth: 120,
      cellClassName: 'enabled',
      getActions: (params) => {
        return [<ToggleEntryEnabled entryId={params.id.toString()} />];
      }
    }
  ];

  return (
    <>
      <Typography variant="h3">Entry Control</Typography>
      <DatasetsView datasets={datasets} additionalColumns={additionalColumns} />
    </>
  );
};
