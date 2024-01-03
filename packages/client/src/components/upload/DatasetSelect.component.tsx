import { Dispatch, SetStateAction } from 'react';
import { SelectChangeEvent, FormControl, Select, MenuItem } from '@mui/material';
import { Dataset } from '../../graphql/graphql';
import { useDataset } from '../../context/Dataset.context';

export interface DatasetSelectProps {
  selectedDataset: Dataset | null;
  setSelectedDataset: Dispatch<SetStateAction<Dataset | null>>;
}

export const DatasetSelect: React.FC<DatasetSelectProps> = ({ selectedDataset, setSelectedDataset }) => {
  const { datasets } = useDataset();

  const handleChange = (event: SelectChangeEvent) => {
    const dataset = datasets.find((dataset) => dataset._id == event.target.value);
    if (!dataset) {
      console.error(`Dataset with id ${event.target.value} not found`);
      return;
    }

    setSelectedDataset(dataset);
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <Select
        sx={{ width: 200 }}
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        label="dataset"
        value={selectedDataset ? selectedDataset._id : ''}
        onChange={handleChange}
      >
        {datasets.map((dataset) => (
          <MenuItem key={dataset._id} value={dataset._id}>
            {dataset.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
