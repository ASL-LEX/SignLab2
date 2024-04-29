import { useGetDatasetsQuery } from '../../graphql/dataset/dataset';
import { useEffect, useState } from 'react';
import { Dataset } from '../../graphql/graphql';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';


export const DatasetDownloads: React.FC = () => {
  const getDatasetResult = useGetDatasetsQuery();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    if (getDatasetResult.data) {
      setDatasets(getDatasetResult.data.getDatasets);
    }
  }, [getDatasetResult.data]);

  return (
    <>
      <FormControl>
        <InputLabel>Dataset Select</InputLabel>
        <Select
          value={selectedDataset}
          onChange={(event) => setSelectedDataset(event.target.value as Dataset)}
        >
          {datasets.map(dataset =>
            <MenuItem value={dataset as any}>{dataset.name}</MenuItem>
          )}
        </Select>
      </FormControl>
    </>
  );
};
