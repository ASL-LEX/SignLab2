import { ReactNode, FC, createContext, useContext, useEffect, useState } from 'react';
import { useStudy } from './Study.context';
import { AssignTagMutation, useAssignTagMutation } from '../graphql/tag/tag';
import { usePermission } from './Permission.context';

export interface TagContextProps {
  tag: AssignTagMutation['assignTag'] | null;
  training: boolean;
  requestTag: () => void;
}

const TagContext = createContext<TagContextProps>({} as TagContextProps);

export interface TagProviderProps {
  children: ReactNode;
}

export const TagProvider: FC<TagProviderProps> = ({ children }) => {
  const { study } = useStudy();
  const [tag, setTag] = useState<AssignTagMutation['assignTag'] | null>(null);
  const [assignTag, assignTagResult] = useAssignTagMutation();
  const { permission } = usePermission();
  const [training, setTraining] = useState<boolean>(false);

  useEffect(() => {
    requestTag();

    setTraining(permission ? !permission.trainedContributor : false);
  }, [permission]);

  useEffect(() => {
    setTag(assignTagResult.data?.assignTag);
  }, [assignTagResult.data]);

  const requestTag = () => {
    if (!study) {
      setTag(null);
      return;
    }

    assignTag({ variables: { study: study._id }, fetchPolicy: 'network-only' });
  };

  return <TagContext.Provider value={{ tag, requestTag, training }}>{children}</TagContext.Provider>;
};

export const useTag = () => useContext(TagContext);
