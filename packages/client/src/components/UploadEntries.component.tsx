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
import { CreateUploadSessionDocument, GetCsvUploadUrlDocument, ValidateCsvDocument } from '../graphql/upload-session/upload-session';
import axios from 'axios';
import { useApolloClient } from '@apollo/client';

interface ShowProps {
  show: boolean;
  toggleModal: () => void;
}

export const UploadEntries: React.FC<ShowProps> = (props: ShowProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [currentStepLimit, setCurrentStepLimit] = useState(0);
  const [uploadSession, setUploadSession] = useState<UploadSession | null>(null);
  const [validationMessage, setValidationMessage] = useState<ValidationMessage | null>(null);
  const [csvValid, setCsvValid] = useState<boolean>(false);

  useEffect(() => {
    let activeStep = 0;
    let currentStepLimit = 0;

    if (selectedDataset) {
      activeStep++;
      currentStepLimit++;
    }

    if (csvValid) {
      activeStep++;
      currentStepLimit++;
    }

    setActiveStep(activeStep);
    setCurrentStepLimit(currentStepLimit);

  }, [selectedDataset, csvValid]);

  const steps = [
    {
      label: 'Select Dataset to Upload To',
      description: `Select Existing Dataset.`,
      element: <DatasetSelect setSelectedDataset={setSelectedDataset} selectedDataset={selectedDataset} />
    },
    {
      label: 'Upload Information on Entries',
      description: '',
      element: <CSVUpload
        dataset={selectedDataset}
        uploadSession={uploadSession}
        setUploadSession={setUploadSession}
        setValidationMessage={setValidationMessage}
        setCsvValid={setCsvValid}
        />
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
          <ValidationMessageDisplay validationMessage={validationMessage} />
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
  setValidationMessage: Dispatch<SetStateAction<ValidationMessage | null>>;
  setCsvValid: Dispatch<SetStateAction<boolean>>;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ dataset, setUploadSession, setValidationMessage, setCsvValid }) => {
  const apolloClient = useApolloClient();

  // Implemented with using the apollo client directly instead of the useMutation hook
  // to reduce the need for multiple use effects to handle each step change
  const handleCSVChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // First create an upload session
    const sessionCreation = await apolloClient.mutate({
      mutation: CreateUploadSessionDocument,
      variables: { dataset: dataset?._id }
    });

    if (!sessionCreation.data?.createUploadSession) {
      console.error('Failed to create upload session');
      return;
    }

    const uploadSession = sessionCreation.data.createUploadSession;
    setUploadSession(uploadSession);

    // Next get the upload url
    const uploadUrlQuery = await apolloClient.query({
      query: GetCsvUploadUrlDocument,
      variables: { session: uploadSession._id }
    });


    if (!uploadUrlQuery.data?.getCSVUploadURL) {
      console.error('Failed to get upload url');
      return;
    }

    const uploadUrl = uploadUrlQuery.data.getCSVUploadURL;

    // Upload the CSV to the url
    const upload = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': 'text/csv'
      }
    });

    if (upload.status != 200) {
      console.error('Failed to upload CSV');
      return;
    }

    // Trigger the CSV validation
    const validation = await apolloClient.query({
      query: ValidateCsvDocument,
      variables: { session: uploadSession._id }
    });

    // Share any validation results
    const result = validation.data!.validateCSV;
    if (result.success) {
      setValidationMessage({ severity: 'success', message: 'CSV validated successfully' });
      setCsvValid(true);
    } else {
      setValidationMessage({ severity: 'error', message: result.message });
      setCsvValid(false);
    }
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Button component="label" variant="contained" color="primary" startIcon={<UploadIcon />} sx={{ m: 1 }}>
        Upload CSV
        <input type="file" hidden onChange={handleCSVChange} accept='.csv' />
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

interface ValidationMessageDisplayProps {
  validationMessage: ValidationMessage | null;
}

interface ValidationMessage {
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

// TODO: Have the  display have various states for each severity
const ValidationMessageDisplay: React.FC<ValidationMessageDisplayProps> = ({ validationMessage }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {validationMessage && <Typography variant="body2">{validationMessage.message}</Typography>}
    </Box>
  );
};
