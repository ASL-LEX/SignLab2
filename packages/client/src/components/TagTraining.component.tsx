import { DatasetsView } from './DatasetsView.component';
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useGetDatasetsQuery } from '../graphql/dataset/dataset';
import { Dataset, Entry } from '../graphql/graphql';
import { GridColDef } from '@mui/x-data-grid';
import { Switch } from '@mui/material';

export interface TagTrainingComponentProps {
  setTrainingSet: Dispatch<SetStateAction<string[]>>;
  setTaggingSet: Dispatch<SetStateAction<string[]>>;
}

export const TagTrainingComponent: React.FC<TagTrainingComponentProps> = (props) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsResults = useGetDatasetsQuery();

  const trainingSet: Set<string> = new Set();
  const fullSet: Set<string> = new Set();

  const additionalColumns: GridColDef[] = [
    {
      field: 'training',
      headerName: 'Training',
      width: 200,
      renderCell: (params) => (
        <EditSetSwitch
          startingValue={false}
          onLoad={(_entry) => {}}
          add={(entry) => {
            trainingSet.add(entry._id);
            props.setTrainingSet(Array.from(trainingSet));
          }}
          remove={(entry) => {
            trainingSet.delete(entry._id);
            props.setTrainingSet(Array.from(trainingSet));
          }}
          entry={params.row}
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
          onLoad={(entry) => {
            fullSet.add(entry._id);
            props.setTaggingSet(Array.from(fullSet));
          }}
          add={(entry) => {
            fullSet.add(entry._id);
            props.setTaggingSet(Array.from(fullSet));
          }}
          remove={(entry) => {
            fullSet.delete(entry._id);
            props.setTaggingSet(Array.from(fullSet));
          }}
          entry={params.row}
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

  return <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />;
};
