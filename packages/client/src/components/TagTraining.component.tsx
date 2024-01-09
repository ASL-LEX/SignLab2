import { DatasetsView } from './DatasetsView.component';
import { useState, useEffect } from 'react';
import { useGetDatasetsQuery } from '../graphql/dataset/dataset';
import { Dataset } from '../graphql/graphql';

export const TagTrainingComponent = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsResults = useGetDatasetsQuery();

  // TODO: In the future, the datasets retrieved should only be datasets
  //       accessible by the current project
  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasets);
    }
  }, [getDatasetsResults.data]);

  return (
    <>
      <DatasetsView datasets={datasets} />
    </>
  );
};
