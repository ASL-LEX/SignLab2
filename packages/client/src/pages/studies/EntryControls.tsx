import { Box, Switch, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useConfirmation } from '../../context/Confirmation.context';
import { DataGrid, GridActionsCellItem, GridRowId, GridColDef } from '@mui/x-data-grid';
import { useStudy } from '../../context/Study.context';
import { Dataset, Study } from '../../graphql/graphql';
import { DatasetsView } from '../../components/DatasetsView.component';
import { useGetDatasetsByProjectQuery, useGetDatasetsQuery } from '../../graphql/dataset/dataset';
import { useProject } from '../../context/Project.context';
import { useIsEntryEnabledLazyQuery, useSetEntryEnabledMutation } from '../../graphql/tag/tag';
import ToggleEntryEnabled from '../../components/ToggleEntryEnabled.component';

export const EntryControls: React.FC = () => {
  const { study } = useStudy();
  const { project } = useProject();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsResults = useGetDatasetsQuery();
  const getDatasetsByProjectResults = useGetDatasetsByProjectQuery({
    variables: {
      project: project ? project._id : '' // value for 'project'
    }
  });
//   const [setEntryEnabledMutation, setEntryEnabledResults] = useSetEntryEnabledMutation();
//   const confirmation = useConfirmation();

//  const [isEntryEnabled, isEntryEnabledResults] =  useIsEntryEnabledLazyQuery();

  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasets);
    }
  }, [getDatasetsResults.data]);



  //   useEffect(() => {
  //     if (getDatasetsByProjectResults.data) {
  //       setDatasets(getDatasetsByProjectResults.data.getDatasetsByProject);
  //     }
  //   }, [getDatasetsByProjectResults.data]);

//   const handleToggleEnabled = async (id: GridRowId, checked: boolean) => {
//     console.log('cehcked', checked);

//     if (study) {
//       confirmation.pushConfirmationRequest({
//         title: 'Enable Entry',
//         message: 'Are you sure you want to delete this study? Doing so will delete all contained tags',
//         onConfirm: () => {
//           setEntryEnabledMutation({
//             variables: { study: study._id, entry: id.toString(), enabled: checked }
//           });
//         },
//         onCancel: () => {}
//       });
//     } else {
//       console.log('default study not selected', study);
//     }
//   };

  const additionalColumns: GridColDef[] = [
    {
      field: 'enabled',
      type: 'actions',
      headerName: 'Enable',
      width: 120,
      maxWidth: 120,
      cellClassName: 'enabled',
      getActions: (params) => {
        return [
            <ToggleEntryEnabled entryId={params.id.toString()}/>
        //   <Switch
        //     disabled={setEntryEnabledResults.loading}
        //     checked={true}
        //     onChange={(event) => handleToggleEnabled(params.id, event.target.checked)}
        //     inputProps={{ 'aria-label': 'controlled' }}
        //   />
        ];
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
