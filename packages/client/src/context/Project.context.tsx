import { createContext, Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import { Project } from '../graphql/graphql';
import { useGetProjectsQuery } from '../graphql/project/project';

export interface ProjectContextProps {
  project: Project | null;
  setProject: Dispatch<SetStateAction<Project | null>>;
  projects: Project[];
  updateProjectList: () => void;
}

const ProjectContext = createContext<ProjectContextProps>({} as ProjectContextProps);

export interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: FC<ProjectProviderProps> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Query for projects
  const getProjectResults = useGetProjectsQuery();
  useEffect(() => {
    if (getProjectResults.data) {
      setProjects(getProjectResults.data.getProjects);

      // Check if the current project is still in the list
      if (project && !getProjectResults.data.getProjects.find((p) => p._id === project._id)) {
        setProject(null);
      }
    }

  }, [getProjectResults.data, getProjectResults.error]);

  return (
    <ProjectContext.Provider value={{
        project,
        setProject,
        projects,
        updateProjectList: () => getProjectResults.refetch()
      }}>
        {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
