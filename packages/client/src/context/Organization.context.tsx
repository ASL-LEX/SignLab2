import { Organization } from '../graphql/graphql';
import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from 'react';

export interface OrganizationContextProps {
  organization: Organization | null;
  setOrganization: Dispatch<SetStateAction<Organization | null>>;
}

const OrganizationContext = createContext<OrganizationContextProps>({} as OrganizationContextProps);

export interface OrganizationProviderProps {
  children: React.ReactNode;
}

export const OrganizationProvier: FC<OrganizationProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>{children}</OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);

