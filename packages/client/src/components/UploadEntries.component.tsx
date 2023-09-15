import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import { Box, FormControl, IconButton, MenuItem, Paper, Select, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';

interface ShowProps {
  show: boolean;
  toggleModal: () => void;
}

export const UploadEntries: React.FC<ShowProps> = (props: ShowProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [entriesValid, setEntriesValid] = useState(false);
  const [videosValid, setVideosValid] = useState(false);

  const handleNameChange = (event: any) => {
    setName(event.target.value);
    setNameValid(true);
  };

  //need to add logic for checking csv format
  //currently the funcion validates as soon as user
  //clicks the button for both CSV and Videos upload
  const handleEntriesUpload = () => {
    setEntriesValid(true);
  };

  const handleVideosUpload = () => {
    setVideosValid(true);
  };

  const handleNext = () => {
    if (activeStep == 0 && nameValid) {
      console.log('first spot');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep == 1 && entriesValid) {
      console.log('second spot');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep == 2 && videosValid) {
      console.log('third spot');
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      label: 'Select Dataset to Upload To',
      description: `Select Existing Dataset.`,
      element: (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <Select sx={{ width: 200 }} labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" value={name} onChange={handleNameChange} label="name">
            <MenuItem value={10}>
              <Typography variant="body2">dataset name 1</Typography>
            </MenuItem>
            <MenuItem value={20}>
              <Typography variant="body2">collection of data</Typography>
            </MenuItem>
            <MenuItem value={30}>
              <Typography variant="body2">verbs and conjugations</Typography>
            </MenuItem>
          </Select>
        </FormControl>
      )
    },
    {
      label: 'Upload Information on Entries',
      description: '',
      element: (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button onClick={handleEntriesUpload}>Upload CSV</Button>
          <IconButton sx={{ color: 'darkgreen', marginLeft: '20px' }}>
            <DownloadIcon />
          </IconButton>
        </Box>
      )
    },
    {
      label: 'Upload Entry Videos',
      description: '',
      element: (
        <Button onClick={handleVideosUpload} variant="outlined" sx={{ margin: '10px' }}>
          Upload Videos (ZIP)
        </Button>
      )
    }
  ];

  return (
    <div>
      <Dialog open={props.show} onClose={props.toggleModal}>
        <DialogTitle sx={{ fontWeight: 'bold', marginTop: '10px' }}>New Entry Upload</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400 }}>
            <Stepper sx={{ minWidth: 400 }} activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel optional={index === 2 ? <Typography variant="caption">Last step</Typography> : null}>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2">{step.description}</Typography>
                    {step.element ? step.element : null}
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ marginBottom: '15px', marginRight: '15px' }}>
          <Button onClick={props.toggleModal}>Cancel</Button>
          <Button variant="contained" onClick={props.toggleModal}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
