import { ReactNode, FC, createContext, useContext, useEffect, useState } from 'react';
import { useStudy } from './Study.context';
import { AssignTagMutation, useAssignTagMutation } from '../graphql/tag/tag';

export interface TagContextProps {
  tag: AssignTagMutation['assignTag'] | null;
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

  useEffect(() => {
    requestTag();
  }, [study]);

  useEffect(() => {
    if (!assignTagResult.data?.assignTag) {
      return;
    }
    setTag(assignTagResult.data.assignTag);
  }, [assignTagResult.data]);

  const requestTag = () => {
    if (!study) {
      setTag(null);
      return;
    }

    assignTag({ variables: { study: study._id } });
  };

  return <TagContext.Provider value={{ tag, requestTag }}>{children}</TagContext.Provider>;
};

export const useTag = () => useContext(TagContext);
