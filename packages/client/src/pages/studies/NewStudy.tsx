import { Container, Typography, Button, Box, Stepper, Step, StepLabel } from '@mui/material';
import { TagsDisplay } from '../../components/TagsDisplay.component';
import { NewStudyJsonForm } from '../../components/NewStudyJsonForm.component';
import { TagTrainingComponent } from '../../components/TagTraining.component';
import { useState, useEffect } from 'react';
import { StudyCreate, TagSchema } from '../../graphql/graphql';
import { PartialStudyCreate } from '../../types/study';

export const NewStudy: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepLimit, setStepLimit] = useState(0);
  const [partialNewStudy, setPartialNewStudy] = useState<PartialStudyCreate | null>(null);
  const [tagSchema, setTagSchema] = useState<TagSchema | null>(null);

  // Handles mantaining which step the user is on and the step limit
  useEffect(() => {
    if (!partialNewStudy) {
      setStepLimit(0);
      return;
    }

    if (!tagSchema) {
      setStepLimit(1);
      return;
    }

    console.log(tagSchema);

    setStepLimit(2);

  }, [partialNewStudy, tagSchema]);

  const handleNext = () => {
    if (activeStep === stepLimit) {
      return;
    }
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      return;
    }
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = ['Study Identification', 'Construct Tagging Interface', 'Select Tag Training Items'];

  const getSectionComponent = () => {
    switch (activeStep) {
      case 0:
        return <NewStudyJsonForm newStudy={partialNewStudy} setNewStudy={setPartialNewStudy} />;
      case 1:
        return <TagsDisplay tagSchema={tagSchema} setTagSchema={setTagSchema} />;
      case 2:
        return <TagTrainingComponent />;
      default:
        return null;
    }
  }

  return (
    <Container sx={{ flexDirection: 'column' }}>
      <Typography sx={{ margin: '10px 0px 15px 10px' }} variant="h5">
        Create New Study
      </Typography>
      <Container sx={{ maxWidth: 'xl' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - your new study is created</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Start Over</Button>
            </Box>
          </>
        ) : (
          <>
            <Container maxWidth="lg" sx={{ display: 'table', width: '100%', overflow: 'hidden' }}>
              {getSectionComponent()}
            </Container>
            <Box sx={{ marginTop: '30px', display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant="outlined" disabled={activeStep === stepLimit} onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Container>
  );
};
