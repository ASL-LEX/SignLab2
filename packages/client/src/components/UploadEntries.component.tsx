import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
 } from '@mui/material';
import { Dataset, UploadSession } from '../graphql/graphql';
import { CSVUpload } from './upload/CSVUpload.component';
import { StatusMessage } from '../models/StatusMessage';
import { DatasetSelect } from './upload/DatasetSelect.component';
import { EntryUpload } from './upload/EntryUpload.component';

interface ShowProps {
  show: boolean;
  toggleModal: () => void;
}

export const UploadEntries: React.FC<ShowProps> = (props: ShowProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [currentStepLimit, setCurrentStepLimit] = useState(0);
  const [uploadSession, setUploadSession] = useState<UploadSession | null>(null);
  const [validationMessage, setValidationMessage] = useState<StatusMessage | null>(null);
  const [csvValid, setCsvValid] = useState<boolean>(false);

  useEffect(() => {
    let activeStep = 0;
    let currentStepLimit = 0;

    if (selectedDataset) {
      activeStep++;
      currentStepLimit++;
    }

    if (selectedDataset && csvValid) {
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
      element: <EntryUpload uploadSession={uploadSession} />
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

interface ValidationMessageDisplayProps {
  validationMessage: StatusMessage | null;
}

// TODO: Have the  display have various states for each severity
const ValidationMessageDisplay: React.FC<ValidationMessageDisplayProps> = ({ validationMessage }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {validationMessage && <Typography variant="body2">{validationMessage.message}</Typography>}
    </Box>
  );
};
