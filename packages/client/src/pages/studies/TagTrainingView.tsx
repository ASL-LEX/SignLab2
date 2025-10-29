import { useLocation } from 'react-router-dom';
import { User, Study } from '../../graphql/graphql';
import { GetTagsQuery, useCountTrainingTagForStudyLazyQuery, useGetTrainingTagsLazyQuery } from '../../graphql/tag/tag';
import { useEffect, useState } from 'react';
import { TagGridView } from '../../components/tag/view/TagGridView.component';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../context/Snackbar.context';
import { GridPaginationModel } from '@mui/x-data-grid';

export const TagTrainingView: React.FC = () => {
  const state = useLocation().state;
  const user: User = state.user;
  const study: Study = state.study;
  const [tags, setTags] = useState<GetTagsQuery['getTags']>([]);
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [trainingTagsQuery, trainingTagsResult] = useGetTrainingTagsLazyQuery();
  const [totalTags, setTotalTags] = useState<number>(0);
  const [tagCount, tagCountResult] = useCountTrainingTagForStudyLazyQuery();

  useEffect(() => {
    trainingTagsQuery({
      variables: {
        study: study._id,
        user: user.uid,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize
      }
    });
    tagCount({ variables: { study: study._id, user: user.uid } });
  }, [paginationModel]);

  useEffect(() => {
    if (trainingTagsResult.data) {
      setTags(trainingTagsResult.data.getTrainingTags);
    } else if (trainingTagsResult.error) {
      pushSnackbarMessage(t('errors.tagsQuery'), 'error');
      console.error(trainingTagsResult.error);
    }
  }, [trainingTagsResult]);

  useEffect(() => {
    if (tagCountResult.data) {
      setTotalTags(tagCountResult.data.countTrainingTagForStudy);
    } else if (tagCountResult.error) {
      console.error(tagCountResult.error);
    }
  }, [tagCountResult]);

  const refetchTags = () => {
    trainingTagsResult.refetch();
  };

  return (
    <>
      {!tags || tags.length === 0 ? (
        <Typography variant="h3">{t('components.userPermissions.noTrainingTags')}</Typography>
      ) : (
        <TagGridView
          tags={tags}
          study={study}
          refetchTags={refetchTags}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          totalTags={totalTags}
        />
      )}
    </>
  );
};
