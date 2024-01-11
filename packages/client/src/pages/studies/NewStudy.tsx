import { Container, Typography, Button, Box, Stepper, Step, StepLabel } from '@mui/material';
import { TagsDisplay } from '../../components/TagsDisplay.component';
import { NewStudyJsonForm } from '../../components/NewStudyJsonForm.component';
import { TagTrainingComponent } from '../../components/TagTraining.component';
import { useState, useEffect } from 'react';
import { StudyCreate, TagSchema } from '../../graphql/graphql';
import { PartialStudyCreate } from '../../types/study';
import { CreateStudyDocument } from '../../graphql/study/study';
import { useProject } from '../../context/Project.context';
import { useStudy } from '../../context/Study.context';
import { useApolloClient } from '@apollo/client';
import { CreateTagsDocument } from '../../graphql/tag';

export const NewStudy: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepLimit, setStepLimit] = useState(0);
  const [partialNewStudy, setPartialNewStudy] = useState<PartialStudyCreate | null>(null);
  const [tagSchema, setTagSchema] = useState<TagSchema | null>(null);
  const { project } = useProject();
  const { updateStudies } = useStudy();
  const [_trainingSet, setTrainingSet] = useState<string[]>([]);
  const [taggingSet, setTaggingSet] = useState<string[]>([]);
  const apolloClient = useApolloClient();

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

    // TODO: Future work will be done to add in the entry selection step
    setStepLimit(3);
  }, [partialNewStudy, tagSchema]);

  const handleNext = async () => {
    if (activeStep === stepLimit) {
      return;
    }
    if (activeStep === steps.length - 1) {
      // Make sure the required fields are present
      if (!partialNewStudy || !tagSchema) {
        console.error('Reached submission with invalid data');
        return;
      }
      // Make sure a project is selected
      if (!project) {
        console.error('Reached submission with no project selected');
        return;
      }

      const study: StudyCreate = {
        ...partialNewStudy,
        project: project._id,
        tagSchema: tagSchema
      };

      // Make the new study
      const result = await apolloClient.mutate({
        mutation: CreateStudyDocument,
        variables: { study: study }
      });

      if (result.errors || !result.data) {
        console.error('Failed to create study');
        return;
      }

      // Create the corresponding tags
      await apolloClient.mutate({
        mutation: CreateTagsDocument,
        variables: { study: result.data.createStudy._id, entries: taggingSet }
      });
      updateStudies();
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
        return <TagTrainingComponent setTaggingSet={setTaggingSet} setTrainingSet={setTrainingSet} />;
      default:
        return null;
    }
  };

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
