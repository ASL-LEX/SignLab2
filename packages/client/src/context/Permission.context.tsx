import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Permission } from '../graphql/graphql';
import { useProject } from './Project.context';
import { useStudy } from './Study.context';
import { useGetRolesQuery } from '../graphql/permission/permission';

interface PermissionContextProps {
  permission: Permission | null;
}

const PermissionContext = createContext<PermissionContextProps>({} as PermissionContextProps);


export interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [permission, setPermission] = useState<Permission | null>(null);
  const { project } = useProject();
  const { study } = useStudy();

  const rolesQueryResult = useGetRolesQuery({ variables: { project: project?._id, study: study?._id }});

  useEffect(() => {
    if (rolesQueryResult.data) {
      setPermission(rolesQueryResult.data.getRoles);
    }
  }, [rolesQueryResult]);

  return (
    <PermissionContext.Provider value={{ permission }}>
      { children }
    </PermissionContext.Provider>
  )
};

export const usePermission = () => useContext(PermissionContext);
