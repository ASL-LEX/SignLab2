import { Stack } from '@mui/material';
import { EntryView } from '../../components/contribute/EntryView.component';
import { TagForm } from '../../components/contribute/TagForm.component';
import { useStudy } from '../../context/Study.context';


export const TaggingInterface: React.FC = () => {
  const { study } = useStudy();

  return (
    <>
      {study && (
        <Stack direction='row'>
          <EntryView />
          <TagForm study={study} />
        </Stack>
      )}
    </>
  );
};
