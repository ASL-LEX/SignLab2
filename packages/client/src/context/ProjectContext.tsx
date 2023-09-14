import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react';
import { Project } from '../graphql/graphql';
import { useGetProjectLazyQuery } from '../graphql/project/project';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export interface ProjectContextProps {
  project: Project | null;
  setProject: Dispatch<SetStateAction<Project | null>>;
  projects: Project[];
}

const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps);

export interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: FC<ProjectProviderProps> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);


  return (
    <ProjectContext.Provider value={{ project, setProject, projects: [] }}>
        {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
