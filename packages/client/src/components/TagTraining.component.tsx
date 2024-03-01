import { DatasetsView } from './DatasetsView.component';
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useGetDatasetsByProjectLazyQuery } from '../graphql/dataset/dataset';
import { Dataset, Entry } from '../graphql/graphql';
import { GridColDef } from '@mui/x-data-grid';
import { Switch } from '@mui/material';
import { useProject } from '../context/Project.context';

export interface TagTrainingComponentProps {
  setTrainingSet: Dispatch<SetStateAction<string[]>>;
  setTaggingSet: Dispatch<SetStateAction<string[]>>;
}

export const TagTrainingComponent: React.FC<TagTrainingComponentProps> = (props) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const { project } = useProject();
  const [getDatasetsQuery, getDatasetsResults] = useGetDatasetsByProjectLazyQuery();
  const [trainingSet, setTrainingSet] = useState<string[]>([]);
  const [taggingSet, setTaggingSet] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      getDatasetsQuery({ variables: { project: project._id } });
    }
  }, [project]);

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
            setTrainingSet([...trainingSet, entry._id]);
          }}
          remove={(entry) => {
            setTrainingSet(trainingSet.filter((entryID) => entryID != entry._id));
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
          startingValue={false}
          onLoad={(_entry) => {}}
          add={(entry) => {
            setTaggingSet([...taggingSet, entry._id]);
          }}
          remove={(entry) => {
            setTaggingSet(taggingSet.filter((entryID) => entryID != entry._id));
          }}
          entry={params.row}
        />
      )
    }
  ];

  useEffect(() => {
    const entries = Array.from(new Set(taggingSet));
    props.setTaggingSet(entries);
  }, [taggingSet]);

  useEffect(() => {
    const entries = Array.from(new Set(trainingSet));
    props.setTrainingSet(entries);
  }, [trainingSet])

  // TODO: In the future, the datasets retrieved should only be datasets
  //       accessible by the current project
  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasetsByProject);
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
