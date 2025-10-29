import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStudy } from '../../context/Study.context';
import { TagGridView } from '../../components/tag/view/TagGridView.component';
import { useEffect, useState } from 'react';
import { GetTagsQuery, useCountTagForStudyLazyQuery, useGetTagsLazyQuery } from '../../graphql/tag/tag';
import { GridPaginationModel } from '@mui/x-data-grid';

export const TagView: React.FC = () => {
  const { t } = useTranslation();
  const { study } = useStudy();
  const [tags, setTags] = useState<GetTagsQuery['getTags']>([]);
  const [getTagQuery, getTagResult] = useGetTagsLazyQuery();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [totalTags, setTotalTags] = useState<number>(0);
  const [tagCount, tagCountResult] = useCountTagForStudyLazyQuery();

  useEffect(() => {
    if (!study) {
      return;
    }

    getTagQuery({ variables: { study: study._id, page: paginationModel.page, pageSize: paginationModel.pageSize } });
    tagCount({ variables: { study: study._id }});
  }, [study, paginationModel]);

  useEffect(() => {
    if (tagCountResult.data) {
      setTotalTags(tagCountResult.data.countTagForStudy);
    } else if (tagCountResult.error) {
      console.error(tagCountResult.error);
    }
  }, [tagCountResult]);

  useEffect(() => {
    if (!getTagResult.data) {
      return;
    }
    setTags(getTagResult.data.getTags);
  }, [getTagResult]);

  const refetchTags = () => {
    getTagResult.refetch();
  };

  return (
    <>
      <Typography variant="h3"> {t('menu.viewTags')}</Typography>
      {study && <TagGridView study={study} tags={tags} refetchTags={refetchTags} paginationModel={paginationModel} setPaginationModel={setPaginationModel} totalTags={totalTags} />}
    </>
  );
};
