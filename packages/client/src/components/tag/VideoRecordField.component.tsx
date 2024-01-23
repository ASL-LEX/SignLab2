import { ControlProps, RankedTester, rankWith } from '@jsonforms/core';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionSummary, Typography } from '@mui/material';
import { withJsonFormsControlProps } from '@jsonforms/react';

const VideoRecordField: React.FC<ControlProps> = (props) => {
console.log(props.label);
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography sx={{ width: '33%' }}>{props.label}</Typography>
        <Typography>{props.description}</Typography>
      </AccordionSummary>
    </Accordion>
  );
};

export const videoFieldTester: RankedTester = rankWith(10, (uischema, _schema, _rootSchema) => {
  return uischema.options != undefined && uischema.options && uischema.options.customType === 'video';
});

export default withJsonFormsControlProps(VideoRecordField);
