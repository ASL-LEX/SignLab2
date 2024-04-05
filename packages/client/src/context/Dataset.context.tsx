import { createContext, FC, ReactNode, useContext, useState, useEffect } from 'react';
import { Dataset } from '../graphql/graphql';
import { useGetDatasetsQuery } from '../graphql/dataset/dataset';

export interface DatasetContextProps {
  datasets: Dataset[];
  refetch: () => void;
}

const DatasetContext = createContext({} as DatasetContextProps);

export interface DatasetProviderProps {
  children: ReactNode;
}

export const DatasetProvider: FC<DatasetProviderProps> = ({ children }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const getDatasetsResults = useGetDatasetsQuery();

  const refetch = () => {
    getDatasetsResults.refetch();
  };

  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasets);
    }
  }, [getDatasetsResults]);

  return <DatasetContext.Provider value={{ datasets, refetch }}>{children}</DatasetContext.Provider>;
};

export const useDataset = () => useContext(DatasetContext);
