import { useLocation } from 'react-router-dom';
import { User, Study } from '../../graphql/graphql';
import { GetTagsQuery, useGetTrainingTagsQuery } from '../../graphql/tag/tag';
import { useEffect, useState } from 'react';
import { TagGridView } from '../../components/tag/view/TagGridView.component';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const TagTrainingView: React.FC = () => {
  const state = useLocation().state;
  const user: User = state.user;
  const study: Study = state.study;
  const [tags, setTags] = useState<GetTagsQuery['getTags']>([]);
  const { t } = useTranslation();

  const trainingTags = useGetTrainingTagsQuery({ variables: { study: study._id, user: user.uid }});

  useEffect(() => {
    if (trainingTags.data) {
      setTags(trainingTags.data.getTrainingTags);
    }
  }, [trainingTags]);

  return (
    <>
      {(!tags || tags.length === 0) ? <Typography variant="h3">{t('components.userPermissions.noTrainingTags')}</Typography> : <TagGridView tags={tags} study={study} />}
    </>
  );
}
