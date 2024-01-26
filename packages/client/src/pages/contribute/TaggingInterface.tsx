import { Box } from '@mui/material';
import { EntryView } from '../../components/EntryView.component';
import { TagForm } from '../../components/contribute/TagForm.component';
import { useStudy } from '../../context/Study.context';
import { useEffect, useState } from 'react';
import { useCompleteTagMutation } from '../../graphql/tag/tag';
import { NoTagNotification } from '../../components/contribute/NoTagNotification.component';
import { Study } from '../../graphql/graphql';
import { TagProvider, useTag } from '../../context/Tag.context';

export const TaggingInterface: React.FC = () => {
  const { study } = useStudy();

  // TODO: View for when there is no study vs when there is no tag
  return (
    <>
      <TagProvider>
        {study && (
          <>
            <MainView study={study} />
          </>
        )}
      </TagProvider>
    </>
  );
};

interface MainViewProps {
  study: Study;
}

const MainView: React.FC<MainViewProps> = (props) => {
  const { tag, requestTag } = useTag();
  const [completeTag, completeTagResult] = useCompleteTagMutation();
  const [tagData, setTagData] = useState<any>({});

  // Changes made to the tag data
  useEffect(() => {
    if (tagData && tag) {
      // Submit the tag data
      completeTag({ variables: { tag: tag._id, data: tagData } });
    }
  }, [tagData]);

  // Tag submission result
  // TODO: Handle errors
  useEffect(() => {
    if (completeTagResult.data) {
      // Assign a new tag
      requestTag();
    }
  }, [completeTagResult.data]);

  return (
      <>
      {tag ? (
        <Box sx={{ justifyContent: 'space-between', display: 'flex', maxWidth: '80%', margin: 'auto' }}>
          <EntryView
            entry={tag.entry}
            width={500}
            autoPlay={true}
            pauseFrame="start"
            mouseOverControls={false}
            displayControls={true}
          />
          <TagForm study={props.study} setTagData={setTagData} />
        </Box>
      ) : (
        <NoTagNotification studyName={props.study.name} />
      )}
    </>
  );
};
