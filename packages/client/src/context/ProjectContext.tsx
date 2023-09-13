import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { ProjectModel } from '../graphql/graphql';
import { useGetProjectLazyQuery } from '../graphql/project/project';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export interface ProjectContextProps {
  project?: ProjectModel;
  updateProject: (updatedProject: ProjectModel) => void;
}

const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps);

export interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: FC<ProjectProviderProps> = (props) => {
  const [project, setProject] = useState<ProjectModel>();
  const { decoded_token } = useAuth();
  const [getProject] = useGetProjectLazyQuery();
  const theme = useTheme();
  const [projectTheme, setProjectTheme] = useState(theme);

  useEffect(() => {
    if (decoded_token?.projectId) {
      getProject({ variables: { id: decoded_token.projectId } }).then((data: any) => {
        if (data?.getProject) {
          setProject(data.getProject as ProjectModel);
          setProjectTheme(
            createTheme({
              ...theme,
              ...data.getProject.muiTheme
            })
          );
        }
      });
    }
  }, [decoded_token]);

  const updateProject = (updatedProject: ProjectModel) => {
    setProject(updatedProject);
  };

  return (
    <ProjectContext.Provider value={{ project, updateProject }}>
      <ThemeProvider
        theme={createTheme({
          ...projectTheme
        })}
      >
        {props.children}
      </ThemeProvider>
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
