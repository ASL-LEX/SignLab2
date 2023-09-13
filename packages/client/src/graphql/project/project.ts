/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProjectQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;

export type GetProjectQuery = {
  __typename?: 'Query';
  getProject: {
    __typename?: 'ProjectModel';
    id: string;
    name: string;
    description?: string | null;
    logo?: string | null;
    muiTheme: any;
    homePage?: string | null;
    redirectUrl?: string | null;
    createdAt: any;
    updatedAt: any;
    deletedAt?: any | null;
    settings: { __typename?: 'ProjectSettingsModel'; allowSignup: boolean; displayProjectName: boolean };
    authMethods: { __typename?: 'ProjectAuthMethodsModel'; emailAuth: boolean; googleAuth: boolean };
  };
};

export type ListProjectsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ListProjectsQuery = {
  __typename?: 'Query';
  listProjects: Array<{ __typename?: 'ProjectModel'; id: string; name: string; description?: string | null; logo?: string | null }>;
};

export type UpdateProjectSettingsMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  displayProjectName?: Types.InputMaybe<Types.Scalars['Boolean']>;
  allowSignup?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;

export type UpdateProjectSettingsMutation = {
  __typename?: 'Mutation';
  updateProjectSettings: {
    __typename?: 'ProjectModel';
    id: string;
    name: string;
    description?: string | null;
    logo?: string | null;
    homePage?: string | null;
    redirectUrl?: string | null;
    settings: { __typename?: 'ProjectSettingsModel'; displayProjectName: boolean; allowSignup: boolean };
    authMethods: { __typename?: 'ProjectAuthMethodsModel'; googleAuth: boolean; emailAuth: boolean };
  };
};

export type UpdateProjectAuthMethodsMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  googleAuth?: Types.InputMaybe<Types.Scalars['Boolean']>;
  emailAuth?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;

export type UpdateProjectAuthMethodsMutation = {
  __typename?: 'Mutation';
  updateProjectAuthMethods: {
    __typename?: 'ProjectModel';
    id: string;
    name: string;
    description?: string | null;
    logo?: string | null;
    homePage?: string | null;
    redirectUrl?: string | null;
    settings: { __typename?: 'ProjectSettingsModel'; displayProjectName: boolean; allowSignup: boolean };
    authMethods: { __typename?: 'ProjectAuthMethodsModel'; googleAuth: boolean; emailAuth: boolean };
  };
};

export type UpdateProjectMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  name?: Types.InputMaybe<Types.Scalars['String']>;
  description?: Types.InputMaybe<Types.Scalars['String']>;
  logo?: Types.InputMaybe<Types.Scalars['String']>;
  muiTheme?: Types.InputMaybe<Types.Scalars['JSON']>;
  homePage?: Types.InputMaybe<Types.Scalars['String']>;
  redirectUrl?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type UpdateProjectMutation = {
  __typename?: 'Mutation';
  updateProject: {
    __typename?: 'ProjectModel';
    id: string;
    name: string;
    description?: string | null;
    logo?: string | null;
    muiTheme: any;
    homePage?: string | null;
    redirectUrl?: string | null;
    createdAt: any;
    updatedAt: any;
    deletedAt?: any | null;
    settings: { __typename?: 'ProjectSettingsModel'; displayProjectName: boolean; allowSignup: boolean };
    authMethods: { __typename?: 'ProjectAuthMethodsModel'; googleAuth: boolean; emailAuth: boolean };
  };
};

export const GetProjectDocument = gql`
  query getProject($id: String!) {
    getProject(id: $id) {
      id
      name
      description
      logo
      muiTheme
      homePage
      redirectUrl
      createdAt
      updatedAt
      deletedAt
      settings {
        allowSignup
        displayProjectName
      }
      authMethods {
        emailAuth
        googleAuth
      }
    }
  }
`;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions: Apollo.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
}
export function useGetProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, options);
}
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const ListProjectsDocument = gql`
  query listProjects {
    listProjects {
      id
      name
      description
      logo
    }
  }
`;

/**
 * __useListProjectsQuery__
 *
 * To run a query within a React component, call `useListProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListProjectsQuery(baseOptions?: Apollo.QueryHookOptions<ListProjectsQuery, ListProjectsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListProjectsQuery, ListProjectsQueryVariables>(ListProjectsDocument, options);
}
export function useListProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListProjectsQuery, ListProjectsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListProjectsQuery, ListProjectsQueryVariables>(ListProjectsDocument, options);
}
export type ListProjectsQueryHookResult = ReturnType<typeof useListProjectsQuery>;
export type ListProjectsLazyQueryHookResult = ReturnType<typeof useListProjectsLazyQuery>;
export type ListProjectsQueryResult = Apollo.QueryResult<ListProjectsQuery, ListProjectsQueryVariables>;
export const UpdateProjectSettingsDocument = gql`
  mutation updateProjectSettings($id: String!, $displayProjectName: Boolean, $allowSignup: Boolean) {
    updateProjectSettings(id: $id, projectSettings: { displayProjectName: $displayProjectName, allowSignup: $allowSignup }) {
      id
      name
      description
      logo
      homePage
      redirectUrl
      settings {
        displayProjectName
        allowSignup
      }
      authMethods {
        googleAuth
        emailAuth
      }
    }
  }
`;
export type UpdateProjectSettingsMutationFn = Apollo.MutationFunction<UpdateProjectSettingsMutation, UpdateProjectSettingsMutationVariables>;

/**
 * __useUpdateProjectSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateProjectSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectSettingsMutation, { data, loading, error }] = useUpdateProjectSettingsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      displayProjectName: // value for 'displayProjectName'
 *      allowSignup: // value for 'allowSignup'
 *   },
 * });
 */
export function useUpdateProjectSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectSettingsMutation, UpdateProjectSettingsMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProjectSettingsMutation, UpdateProjectSettingsMutationVariables>(UpdateProjectSettingsDocument, options);
}
export type UpdateProjectSettingsMutationHookResult = ReturnType<typeof useUpdateProjectSettingsMutation>;
export type UpdateProjectSettingsMutationResult = Apollo.MutationResult<UpdateProjectSettingsMutation>;
export type UpdateProjectSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateProjectSettingsMutation, UpdateProjectSettingsMutationVariables>;
export const UpdateProjectAuthMethodsDocument = gql`
  mutation updateProjectAuthMethods($id: String!, $googleAuth: Boolean, $emailAuth: Boolean) {
    updateProjectAuthMethods(id: $id, projectAuthMethods: { googleAuth: $googleAuth, emailAuth: $emailAuth }) {
      id
      name
      description
      logo
      homePage
      redirectUrl
      settings {
        displayProjectName
        allowSignup
      }
      authMethods {
        googleAuth
        emailAuth
      }
    }
  }
`;
export type UpdateProjectAuthMethodsMutationFn = Apollo.MutationFunction<UpdateProjectAuthMethodsMutation, UpdateProjectAuthMethodsMutationVariables>;

/**
 * __useUpdateProjectAuthMethodsMutation__
 *
 * To run a mutation, you first call `useUpdateProjectAuthMethodsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectAuthMethodsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectAuthMethodsMutation, { data, loading, error }] = useUpdateProjectAuthMethodsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      googleAuth: // value for 'googleAuth'
 *      emailAuth: // value for 'emailAuth'
 *   },
 * });
 */
export function useUpdateProjectAuthMethodsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectAuthMethodsMutation, UpdateProjectAuthMethodsMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProjectAuthMethodsMutation, UpdateProjectAuthMethodsMutationVariables>(UpdateProjectAuthMethodsDocument, options);
}
export type UpdateProjectAuthMethodsMutationHookResult = ReturnType<typeof useUpdateProjectAuthMethodsMutation>;
export type UpdateProjectAuthMethodsMutationResult = Apollo.MutationResult<UpdateProjectAuthMethodsMutation>;
export type UpdateProjectAuthMethodsMutationOptions = Apollo.BaseMutationOptions<UpdateProjectAuthMethodsMutation, UpdateProjectAuthMethodsMutationVariables>;
export const UpdateProjectDocument = gql`
  mutation updateProject($id: String!, $name: String, $description: String, $logo: String, $muiTheme: JSON, $homePage: String, $redirectUrl: String) {
    updateProject(id: $id, settings: { name: $name, description: $description, logo: $logo, muiTheme: $muiTheme, homePage: $homePage, redirectUrl: $redirectUrl }) {
      id
      name
      description
      logo
      muiTheme
      homePage
      redirectUrl
      createdAt
      updatedAt
      deletedAt
      settings {
        displayProjectName
        allowSignup
      }
      authMethods {
        googleAuth
        emailAuth
      }
    }
  }
`;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      logo: // value for 'logo'
 *      muiTheme: // value for 'muiTheme'
 *      homePage: // value for 'homePage'
 *      redirectUrl: // value for 'redirectUrl'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
}
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
