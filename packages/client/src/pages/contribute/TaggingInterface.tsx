import { Box } from '@mui/material';
import { EntryView } from '../../components/EntryView.component';
import { TagForm } from '../../components/contribute/TagForm.component';
import { useStudy } from '../../context/Study.context';
import { useEffect, useState } from 'react';
import { AssignTagMutation, useAssignTagMutation } from '../../graphql/tag';
import { useCompleteTagMutation } from '../../graphql/tag';


export const TaggingInterface: React.FC = () => {
  const { study } = useStudy();
  const [tag, setTag] = useState<AssignTagMutation['assignTag'] | null>(null);
  const [assignTag, assignTagResult]= useAssignTagMutation();
  const [tagData, setTagData] = useState<any>({});
  const [completeTag, completeTagResult] = useCompleteTagMutation();

  // Changes to study will trigger a new tag assignment
  useEffect(() => {
    // No study, then no tag
    if (!study) {
      setTag(null);
      return;
    }

    // Assign a tag
    assignTag({ variables: { study: study._id }});
  }, [study]);

  // Update to the assigned tag
  useEffect(() => {
    if (!assignTagResult.data) {
      setTag(null);
      return;
    }

    setTag(assignTagResult.data.assignTag);
  }, [assignTagResult.data]);

  // Changes made to the tag data
  useEffect(() => {
    if (tagData && tag) {
      // Submit the tag data
      completeTag({ variables: { tag: tag._id, data: tagData }});
    }
  }, [tagData]);

  // Tag submission result
  // TODO: Handle errors
  useEffect(() => {
    if (completeTagResult.data && study) {
      // Assign a new tag
      assignTag({ variables: { study: study._id }});
    }
  }, [completeTagResult.data]);

  // TODO: View for when there is no study vs when there is no tag
  return (
    <>
      {study && tag && (
        <Box sx={{ justifyContent: 'space-between', display: 'flex', maxWidth: 1000, margin: 'auto' }}>
          <EntryView entry={tag.entry} width={500} autoPlay={true} pauseFrame='start' mouseOverControls={false} displayControls={true} />
          <TagForm study={study} setTagData={setTagData} />
        </Box>
      )}
    </>
  );
};
