import { Accordion, AccordionSummary, Typography, Stack, AccordionDetails } from '@mui/material';
import { Dataset } from '../graphql/graphql';
import { DatasetTable } from './DatasetTable.component';
import { ExpandMore } from '@mui/icons-material';
import {GridColDef} from '@mui/x-data-grid';

export interface DatasetsViewProps {
  datasets: Dataset[];
  additionalColumns?: GridColDef[];
}

// TODO: Implement lazy loading on accordion open to prevent loading all datasets at once
export const DatasetsView: React.FC<DatasetsViewProps> = ({ datasets, additionalColumns }) => {
  return (
    <>
      {datasets.map((dataset: Dataset) => (
        <Accordion key={dataset._id} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" spacing={6}>
              <Typography>{dataset.name}</Typography>
              <Typography>{dataset.description}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <DatasetTable dataset={dataset} additionalColumns={additionalColumns} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};
