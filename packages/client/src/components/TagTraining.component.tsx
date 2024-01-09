import { DatasetsView } from './DatasetsView.component';
import { useState, useEffect } from 'react';
import { useGetDatasetsQuery } from '../graphql/dataset/dataset';
import { Dataset, Entry } from '../graphql/graphql';
import { GridColDef } from '@mui/x-data-grid';
import { Switch } from '@mui/material';

export const TagTrainingComponent = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsResults = useGetDatasetsQuery();

  const trainingSet: Set<Entry> = new Set();
  const fullSet: Set<Entry> = new Set();

  const trainingOnLoad = (entry: Entry) => {
  };

  const addToTrainingSet = (entry: Entry) => {

  };

  const removeFromTrainingSet = (entry: Entry) => {

  };

  const fullSetOnLoad = (entry: Entry) => {
    fullSet.add(entry);
  };

  const addToFullSet = (entry: Entry) => {

  };

  const removeFromFullSet = (entry: Entry) => {

  };

  const additionalColumns: GridColDef[] = [
    {
      field: 'training',
      headerName: 'Training',
      width: 200,
      renderCell: (params) => (
        <EditSetSwitch
          startingValue={false}
          onLoad={trainingOnLoad}
          add={addToTrainingSet}
          remove={removeFromTrainingSet}
          entry={params.value}
        />
      )
    },
    {
      field: 'full',
      headerName: 'Available for Tagging',
      width: 200,
      renderCell: (params) => (
        <EditSetSwitch
          startingValue={true}
          onLoad={fullSetOnLoad}
          add={addToFullSet}
          remove={removeFromFullSet}
          entry={params.value}
        />
      )
    }
  ];

  // TODO: In the future, the datasets retrieved should only be datasets
  //       accessible by the current project
  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasets);
    }
  }, [getDatasetsResults.data]);

  return (
    <>
      <DatasetsView datasets={datasets} additionalColumns={additionalColumns} />
    </>
  );
};

interface EditSwitchProps {
  startingValue: boolean;
  add: (entry: Entry) => void;
  remove: (entry: Entry) => void;
  onLoad: (entry: Entry) => void;
  entry: Entry;
}

const EditSetSwitch: React.FC<EditSwitchProps> = (props) => {
  const [checked, setChecked] = useState(props.startingValue);

  useEffect(() => {
    props.onLoad(props.entry);
  }, [props.entry]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      props.add(props.entry);
    } else {
      props.remove(props.entry);
    }
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
};
