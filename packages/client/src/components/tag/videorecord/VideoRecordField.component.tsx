import { ControlProps, RankedTester, rankWith } from '@jsonforms/core';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Stack } from '@mui/material';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { StatusProcessCircles } from './StatusCircles.component';

const VideoRecordField: React.FC<ControlProps> = (props) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography sx={{ width: '33%' }}>{props.label}</Typography>
        <Typography>{props.description}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={2} sx={{ width: '50%' }}>
          <StatusProcessCircles isComplete={[true, false, false]} setState={() => {}} activeIndex={2} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export const videoFieldTester: RankedTester = rankWith(10, (uischema, _schema, _rootSchema) => {
  return uischema.options != undefined && uischema.options && uischema.options.customType === 'video';
});

export default withJsonFormsControlProps(VideoRecordField);
