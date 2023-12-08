import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState, useEffect } from 'react';
import { Study } from '../graphql/graphql';
import { useProject } from './Project.context';
import { useFindStudiesLazyQuery } from '../graphql/study/study';

export interface StudyContextProps {
  study: Study | null;
  setStudy: Dispatch<SetStateAction<Study | null>>;
  studies: Study[];
  updateStudies: () => void;
}

const StudyContext = createContext<StudyContextProps>({} as StudyContextProps);

export interface StudyProviderProps {
  children: ReactNode;
}

export const StudyProvider: FC<StudyProviderProps> = (props) => {
  const [study, setStudy] = useState<Study | null>(null);
  const [studies, setStudies] = useState<Study[]>([]);

  const [findStudies, findStudiesResults] = useFindStudiesLazyQuery();

  const { project } = useProject();

  const updateStudies = () => {
    if (project) {
      findStudiesResults.refetch({ project: project._id });
    }
  };

  // Effect to re-query for studies
  useEffect(() => {
    if (!project) {
      setStudies([]);
      return;
    }
    findStudies({ variables: { project: project._id } });
  }, [project]);

  // Effect to update list of studies
  useEffect(() => {
    if (findStudiesResults.data) {
      setStudies(findStudiesResults.data.findStudies);
    }
  }, [findStudiesResults]);

  return <StudyContext.Provider value={{ study, setStudy, studies, updateStudies }}>{props.children}</StudyContext.Provider>;
};

export const useStudy = () => useContext(StudyContext);
