/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProjectPermissionsQueryVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
}>;


export type GetProjectPermissionsQuery = { __typename?: 'Query', getProjectPermissions: Array<{ __typename?: 'ProjectPermissionModel', isProjectAdmin: boolean, editable: boolean, user: { __typename?: 'User', uid: string, email?: string | null, displayName?: string | null, photoURL?: string | null } }> };

export type GrantProjectPermissionsMutationVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
  user: Types.Scalars['ID']['input'];
  isAdmin: Types.Scalars['Boolean']['input'];
}>;


export type GrantProjectPermissionsMutation = { __typename?: 'Mutation', grantProjectPermissions: boolean };

export type GetStudyPermissionsQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type GetStudyPermissionsQuery = { __typename?: 'Query', getStudyPermissions: Array<{ __typename?: 'StudyPermissionModel', isStudyAdmin: boolean, isStudyAdminEditable: boolean, isContributor: boolean, isContributorEditable: boolean, isTrained: boolean, isTrainedEditable: boolean, user: { __typename?: 'User', uid: string, email?: string | null, displayName?: string | null, photoURL?: string | null } }> };

export type GrantStudyAdminMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  user: Types.Scalars['ID']['input'];
  isAdmin: Types.Scalars['Boolean']['input'];
}>;


export type GrantStudyAdminMutation = { __typename?: 'Mutation', grantStudyAdmin: boolean };

export type GrantContributorMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  user: Types.Scalars['ID']['input'];
  isContributor: Types.Scalars['Boolean']['input'];
}>;


export type GrantContributorMutation = { __typename?: 'Mutation', grantContributor: boolean };

export type GrantTrainedContributorMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  user: Types.Scalars['ID']['input'];
  isTrained: Types.Scalars['Boolean']['input'];
}>;


export type GrantTrainedContributorMutation = { __typename?: 'Mutation', grantTrainedContributor: boolean };

export type GetDatasetProjectPermissionsQueryVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
}>;


export type GetDatasetProjectPermissionsQuery = { __typename?: 'Query', getDatasetProjectPermissions: Array<{ __typename?: 'DatasetProjectPermission', projectHasAccess: boolean, dataset: { __typename?: 'Dataset', _id: string, name: string, description: string } }> };

export type GrantProjectDatasetAccessMutationVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
  dataset: Types.Scalars['ID']['input'];
  hasAccess: Types.Scalars['Boolean']['input'];
}>;


export type GrantProjectDatasetAccessMutation = { __typename?: 'Mutation', grantProjectDatasetAccess: boolean };

export type GetRolesQueryVariables = Types.Exact<{
  project?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  study?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type GetRolesQuery = { __typename?: 'Query', getRoles: { __typename?: 'Permission', owner: boolean, projectAdmin: boolean, studyAdmin: boolean, trainedContributor: boolean, contributor: boolean } };


export const GetProjectPermissionsDocument = gql`
    query getProjectPermissions($project: ID!) {
  getProjectPermissions(project: $project) {
    user {
      uid
      email
      displayName
      photoURL
    }
    isProjectAdmin
    editable
  }
}
    `;

/**
 * __useGetProjectPermissionsQuery__
 *
 * To run a query within a React component, call `useGetProjectPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectPermissionsQuery({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useGetProjectPermissionsQuery(baseOptions: Apollo.QueryHookOptions<GetProjectPermissionsQuery, GetProjectPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectPermissionsQuery, GetProjectPermissionsQueryVariables>(GetProjectPermissionsDocument, options);
      }
export function useGetProjectPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectPermissionsQuery, GetProjectPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectPermissionsQuery, GetProjectPermissionsQueryVariables>(GetProjectPermissionsDocument, options);
        }
export type GetProjectPermissionsQueryHookResult = ReturnType<typeof useGetProjectPermissionsQuery>;
export type GetProjectPermissionsLazyQueryHookResult = ReturnType<typeof useGetProjectPermissionsLazyQuery>;
export type GetProjectPermissionsQueryResult = Apollo.QueryResult<GetProjectPermissionsQuery, GetProjectPermissionsQueryVariables>;
export const GrantProjectPermissionsDocument = gql`
    mutation grantProjectPermissions($project: ID!, $user: ID!, $isAdmin: Boolean!) {
  grantProjectPermissions(project: $project, user: $user, isAdmin: $isAdmin)
}
    `;
export type GrantProjectPermissionsMutationFn = Apollo.MutationFunction<GrantProjectPermissionsMutation, GrantProjectPermissionsMutationVariables>;

/**
 * __useGrantProjectPermissionsMutation__
 *
 * To run a mutation, you first call `useGrantProjectPermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGrantProjectPermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [grantProjectPermissionsMutation, { data, loading, error }] = useGrantProjectPermissionsMutation({
 *   variables: {
 *      project: // value for 'project'
 *      user: // value for 'user'
 *      isAdmin: // value for 'isAdmin'
 *   },
 * });
 */
export function useGrantProjectPermissionsMutation(baseOptions?: Apollo.MutationHookOptions<GrantProjectPermissionsMutation, GrantProjectPermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GrantProjectPermissionsMutation, GrantProjectPermissionsMutationVariables>(GrantProjectPermissionsDocument, options);
      }
export type GrantProjectPermissionsMutationHookResult = ReturnType<typeof useGrantProjectPermissionsMutation>;
export type GrantProjectPermissionsMutationResult = Apollo.MutationResult<GrantProjectPermissionsMutation>;
export type GrantProjectPermissionsMutationOptions = Apollo.BaseMutationOptions<GrantProjectPermissionsMutation, GrantProjectPermissionsMutationVariables>;
export const GetStudyPermissionsDocument = gql`
    query getStudyPermissions($study: ID!) {
  getStudyPermissions(study: $study) {
    user {
      uid
      email
      displayName
      photoURL
    }
    isStudyAdmin
    isStudyAdminEditable
    isContributor
    isContributorEditable
    isTrained
    isTrainedEditable
  }
}
    `;

/**
 * __useGetStudyPermissionsQuery__
 *
 * To run a query within a React component, call `useGetStudyPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudyPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudyPermissionsQuery({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useGetStudyPermissionsQuery(baseOptions: Apollo.QueryHookOptions<GetStudyPermissionsQuery, GetStudyPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudyPermissionsQuery, GetStudyPermissionsQueryVariables>(GetStudyPermissionsDocument, options);
      }
export function useGetStudyPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudyPermissionsQuery, GetStudyPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudyPermissionsQuery, GetStudyPermissionsQueryVariables>(GetStudyPermissionsDocument, options);
        }
export type GetStudyPermissionsQueryHookResult = ReturnType<typeof useGetStudyPermissionsQuery>;
export type GetStudyPermissionsLazyQueryHookResult = ReturnType<typeof useGetStudyPermissionsLazyQuery>;
export type GetStudyPermissionsQueryResult = Apollo.QueryResult<GetStudyPermissionsQuery, GetStudyPermissionsQueryVariables>;
export const GrantStudyAdminDocument = gql`
    mutation grantStudyAdmin($study: ID!, $user: ID!, $isAdmin: Boolean!) {
  grantStudyAdmin(study: $study, user: $user, isAdmin: $isAdmin)
}
    `;
export type GrantStudyAdminMutationFn = Apollo.MutationFunction<GrantStudyAdminMutation, GrantStudyAdminMutationVariables>;

/**
 * __useGrantStudyAdminMutation__
 *
 * To run a mutation, you first call `useGrantStudyAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGrantStudyAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [grantStudyAdminMutation, { data, loading, error }] = useGrantStudyAdminMutation({
 *   variables: {
 *      study: // value for 'study'
 *      user: // value for 'user'
 *      isAdmin: // value for 'isAdmin'
 *   },
 * });
 */
export function useGrantStudyAdminMutation(baseOptions?: Apollo.MutationHookOptions<GrantStudyAdminMutation, GrantStudyAdminMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GrantStudyAdminMutation, GrantStudyAdminMutationVariables>(GrantStudyAdminDocument, options);
      }
export type GrantStudyAdminMutationHookResult = ReturnType<typeof useGrantStudyAdminMutation>;
export type GrantStudyAdminMutationResult = Apollo.MutationResult<GrantStudyAdminMutation>;
export type GrantStudyAdminMutationOptions = Apollo.BaseMutationOptions<GrantStudyAdminMutation, GrantStudyAdminMutationVariables>;
export const GrantContributorDocument = gql`
    mutation grantContributor($study: ID!, $user: ID!, $isContributor: Boolean!) {
  grantContributor(study: $study, user: $user, isContributor: $isContributor)
}
    `;
export type GrantContributorMutationFn = Apollo.MutationFunction<GrantContributorMutation, GrantContributorMutationVariables>;

/**
 * __useGrantContributorMutation__
 *
 * To run a mutation, you first call `useGrantContributorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGrantContributorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [grantContributorMutation, { data, loading, error }] = useGrantContributorMutation({
 *   variables: {
 *      study: // value for 'study'
 *      user: // value for 'user'
 *      isContributor: // value for 'isContributor'
 *   },
 * });
 */
export function useGrantContributorMutation(baseOptions?: Apollo.MutationHookOptions<GrantContributorMutation, GrantContributorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GrantContributorMutation, GrantContributorMutationVariables>(GrantContributorDocument, options);
      }
export type GrantContributorMutationHookResult = ReturnType<typeof useGrantContributorMutation>;
export type GrantContributorMutationResult = Apollo.MutationResult<GrantContributorMutation>;
export type GrantContributorMutationOptions = Apollo.BaseMutationOptions<GrantContributorMutation, GrantContributorMutationVariables>;
export const GrantTrainedContributorDocument = gql`
    mutation grantTrainedContributor($study: ID!, $user: ID!, $isTrained: Boolean!) {
  grantTrainedContributor(study: $study, user: $user, isTrained: $isTrained)
}
    `;
export type GrantTrainedContributorMutationFn = Apollo.MutationFunction<GrantTrainedContributorMutation, GrantTrainedContributorMutationVariables>;

/**
 * __useGrantTrainedContributorMutation__
 *
 * To run a mutation, you first call `useGrantTrainedContributorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGrantTrainedContributorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [grantTrainedContributorMutation, { data, loading, error }] = useGrantTrainedContributorMutation({
 *   variables: {
 *      study: // value for 'study'
 *      user: // value for 'user'
 *      isTrained: // value for 'isTrained'
 *   },
 * });
 */
export function useGrantTrainedContributorMutation(baseOptions?: Apollo.MutationHookOptions<GrantTrainedContributorMutation, GrantTrainedContributorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GrantTrainedContributorMutation, GrantTrainedContributorMutationVariables>(GrantTrainedContributorDocument, options);
      }
export type GrantTrainedContributorMutationHookResult = ReturnType<typeof useGrantTrainedContributorMutation>;
export type GrantTrainedContributorMutationResult = Apollo.MutationResult<GrantTrainedContributorMutation>;
export type GrantTrainedContributorMutationOptions = Apollo.BaseMutationOptions<GrantTrainedContributorMutation, GrantTrainedContributorMutationVariables>;
export const GetDatasetProjectPermissionsDocument = gql`
    query getDatasetProjectPermissions($project: ID!) {
  getDatasetProjectPermissions(project: $project) {
    dataset {
      _id
      name
      description
    }
    projectHasAccess
  }
}
    `;

/**
 * __useGetDatasetProjectPermissionsQuery__
 *
 * To run a query within a React component, call `useGetDatasetProjectPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetProjectPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetProjectPermissionsQuery({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useGetDatasetProjectPermissionsQuery(baseOptions: Apollo.QueryHookOptions<GetDatasetProjectPermissionsQuery, GetDatasetProjectPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDatasetProjectPermissionsQuery, GetDatasetProjectPermissionsQueryVariables>(GetDatasetProjectPermissionsDocument, options);
      }
export function useGetDatasetProjectPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDatasetProjectPermissionsQuery, GetDatasetProjectPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDatasetProjectPermissionsQuery, GetDatasetProjectPermissionsQueryVariables>(GetDatasetProjectPermissionsDocument, options);
        }
export type GetDatasetProjectPermissionsQueryHookResult = ReturnType<typeof useGetDatasetProjectPermissionsQuery>;
export type GetDatasetProjectPermissionsLazyQueryHookResult = ReturnType<typeof useGetDatasetProjectPermissionsLazyQuery>;
export type GetDatasetProjectPermissionsQueryResult = Apollo.QueryResult<GetDatasetProjectPermissionsQuery, GetDatasetProjectPermissionsQueryVariables>;
export const GrantProjectDatasetAccessDocument = gql`
    mutation grantProjectDatasetAccess($project: ID!, $dataset: ID!, $hasAccess: Boolean!) {
  grantProjectDatasetAccess(
    project: $project
    dataset: $dataset
    hasAccess: $hasAccess
  )
}
    `;
export type GrantProjectDatasetAccessMutationFn = Apollo.MutationFunction<GrantProjectDatasetAccessMutation, GrantProjectDatasetAccessMutationVariables>;

/**
 * __useGrantProjectDatasetAccessMutation__
 *
 * To run a mutation, you first call `useGrantProjectDatasetAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGrantProjectDatasetAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [grantProjectDatasetAccessMutation, { data, loading, error }] = useGrantProjectDatasetAccessMutation({
 *   variables: {
 *      project: // value for 'project'
 *      dataset: // value for 'dataset'
 *      hasAccess: // value for 'hasAccess'
 *   },
 * });
 */
export function useGrantProjectDatasetAccessMutation(baseOptions?: Apollo.MutationHookOptions<GrantProjectDatasetAccessMutation, GrantProjectDatasetAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GrantProjectDatasetAccessMutation, GrantProjectDatasetAccessMutationVariables>(GrantProjectDatasetAccessDocument, options);
      }
export type GrantProjectDatasetAccessMutationHookResult = ReturnType<typeof useGrantProjectDatasetAccessMutation>;
export type GrantProjectDatasetAccessMutationResult = Apollo.MutationResult<GrantProjectDatasetAccessMutation>;
export type GrantProjectDatasetAccessMutationOptions = Apollo.BaseMutationOptions<GrantProjectDatasetAccessMutation, GrantProjectDatasetAccessMutationVariables>;
export const GetRolesDocument = gql`
    query getRoles($project: ID, $study: ID) {
  getRoles(project: $project, study: $study) {
    owner
    projectAdmin
    studyAdmin
    trainedContributor
    contributor
  }
}
    `;

/**
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *      project: // value for 'project'
 *      study: // value for 'study'
 *   },
 * });
 */
export function useGetRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
      }
export function useGetRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
export type GetRolesQueryResult = Apollo.QueryResult<GetRolesQuery, GetRolesQueryVariables>;