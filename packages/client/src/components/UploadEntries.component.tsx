import UploadIcon from '@mui/icons-material/Upload';
import { Dispatch, useState, SetStateAction, useEffect, ChangeEvent } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  FormControl,
  MenuItem,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  SelectChangeEvent
 } from '@mui/material';
import { useDataset } from '../context/Dataset.context';
import { Dataset, UploadSession } from '../graphql/graphql';
import { useCreateUploadSessionMutation, useGetCsvUploadUrlLazyQuery } from '../graphql/upload-session/upload-session';
import axios from 'axios';

interface ShowProps {
  show: boolean;
  toggleModal: () => void;
}

export const UploadEntries: React.FC<ShowProps> = (props: ShowProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [currentStepLimit, setCurrentStepLimit] = useState(0);
  const [uploadSession, setUploadSession] = useState<UploadSession | null>(null);

  useEffect(() => {
    if (selectedDataset) {
      setActiveStep(1);
      setCurrentStepLimit(1);
    }
  }, [selectedDataset]);

  const steps = [
    {
      label: 'Select Dataset to Upload To',
      description: `Select Existing Dataset.`,
      element: <DatasetSelect setSelectedDataset={setSelectedDataset} selectedDataset={selectedDataset} />
    },
    {
      label: 'Upload Information on Entries',
      description: '',
      element: <CSVUpload dataset={selectedDataset} uploadSession={uploadSession} setUploadSession={setUploadSession} />
    },
    {
      label: 'Upload Entry Videos',
      description: '',
      element: <EntryUpload />
    }
  ];

  const nextOrComplete = () => {
    if (activeStep === steps.length - 1) {
      props.toggleModal();
    } else {
      if (selectedDataset) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div>
      <Dialog open={props.show} onClose={props.toggleModal}>
        <DialogTitle sx={{ fontWeight: 'bold', marginTop: '10px' }}>New Entry Upload</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400 }}>
            <Stepper sx={{ minWidth: 400 }} activeStep={activeStep} orientation="vertical">
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2">{step.description}</Typography>
                    {step.element}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ marginBottom: '15px', marginRight: '15px' }}>
          {activeStep != 0 && <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>}
          <Button onClick={props.toggleModal}>Cancel</Button>
          <Button
            onClick={nextOrComplete}
            disabled={activeStep >= currentStepLimit}>
            {activeStep == steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

interface DatasetSelectProps {
  selectedDataset: Dataset | null;
  setSelectedDataset: Dispatch<SetStateAction<Dataset | null>>;
}

const DatasetSelect: React.FC<DatasetSelectProps> = ({ selectedDataset, setSelectedDataset }) => {
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
      <Select sx={{ width: 200 }}
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        label="dataset"
        value={selectedDataset ? selectedDataset._id : ''}
        onChange={handleChange}>
        {datasets.map((dataset) => (
          <MenuItem key={dataset._id} value={dataset._id}>
            {dataset.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface CSVUploadProps {
  dataset: Dataset | null;
  uploadSession: UploadSession | null;
  setUploadSession: Dispatch<SetStateAction<UploadSession | null>>;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ dataset, uploadSession, setUploadSession }) => {
  const [createUploadSessionMutation, createUploadSessionResults] = useCreateUploadSessionMutation();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [getCSVUploadFile, getCSVUploadFileResult] = useGetCsvUploadUrlLazyQuery();

  // 1. Create the upload session
  const handleCSVUpload = (event: ChangeEvent) => {
    // Get the file from the event
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    setCsvFile(file);

    // Should not get here, should not move to the CSV upload step if the
    // dataset is not selected
    if (!dataset) {
      console.error('Dataset not selected');
      return;
    }

    // Create a new upload session
    createUploadSessionMutation({ variables: { dataset: dataset._id }});
  };

  // 2. Once the upload session is created, get the CSV upload URL
  useEffect(() => {
    if (createUploadSessionResults.data) {
      // Get the created upload session
      const createdUploadSession = createUploadSessionResults.data.createUploadSession;
      setUploadSession(createdUploadSession);

      // Get the CSV upload URL
      getCSVUploadFile({ variables: { session: createdUploadSession._id }});
    }
  }, [createUploadSessionResults.data]);

  // 3. Once the CSV upload URL is retrieved, upload the CSV
  useEffect(() => {
    if (getCSVUploadFileResult.data) {
    const csvURL = getCSVUploadFileResult.data.getCSVUploadURL;
      axios.put(csvURL, csvFile, {
        headers: {
          'Content-Type': 'text/csv'
        }
      }).then((response) => {
        console.log(response);
      });
    }
  }, [getCSVUploadFileResult.data]);



  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Button component="label" variant="contained" color="primary" startIcon={<UploadIcon />} sx={{ m: 1 }}>
        Upload CSV
        <input type="file" hidden onChange={handleCSVUpload} accept='.csv' />
      </Button>
    </Box>
  );
};

const EntryUpload: React.FC = () => {
  return (
    <Button variant="outlined" sx={{ margin: '10px' }}>
      Upload Videos (ZIP)
    </Button>
  );
};
