import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
import { Study } from '../graphql/graphql';

export interface StudyContextProps {
  study: Study | null;
  setStudy: Dispatch<SetStateAction<Study | null>>;
  studies: Study[];
}

const StudyContext = createContext<StudyContextProps>({} as StudyContextProps);

export interface StudyProviderProps {
  children: ReactNode;
}

export const StudyProvider: FC<StudyProviderProps> = (props) => {
  const [study, setStudy] = useState<Study | null>(null);

  return <StudyContext.Provider value={{ study, setStudy, studies: [] }}>{props.children}</StudyContext.Provider>;
};

export const useStudy = () => useContext(StudyContext);
