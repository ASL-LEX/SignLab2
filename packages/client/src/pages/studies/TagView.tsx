import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStudy } from '../../context/Study.context';
import { TagGridView } from '../../components/tag/view/TagGridView.component';
import { useEffect, useState } from 'react';
import { GetTagsQuery, useGetTagsLazyQuery } from '../../graphql/tag/tag';

export const TagView: React.FC = () => {
  const { t } = useTranslation();
  const { study } = useStudy();
  const [tags, setTags] = useState<GetTagsQuery['getTags']>([]);
  const [getTagQuery, getTagResult] = useGetTagsLazyQuery();

  useEffect(() => {
    if (!study) {
      return;
    }

    getTagQuery({ variables: { study: study._id } });
  }, [study]);

  useEffect(() => {
    if (!getTagResult.data) {
      return;
    }
    setTags(getTagResult.data.getTags);
  }, [getTagResult]);

  const refetch = () => {
    getTagResult.refetch();
  };

  return (
    <Container sx={{ position: 'center', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
      <Typography variant="h3"> {t('menu.viewTags')}</Typography>
      {study && <TagGridView study={study} tags={tags} refetchTags={refetch} />}
    </Container>
  );
};
