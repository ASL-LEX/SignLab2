/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProjectPermissionsQueryVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
}>;


export type GetProjectPermissionsQuery = { __typename?: 'Query', getProjectPermissions: Array<{ __typename?: 'Permission', hasRole: boolean, editable: boolean, role: Types.Roles, user: { __typename?: 'UserModel', id: string, projectId: string, fullname?: string | null, username?: string | null, email?: string | null, role: number, createdAt: any, updatedAt: any, deletedAt?: any | null } }> };

export type GrantProjectPermissionsMutationVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
  user: Types.Scalars['ID']['input'];
  isAdmin: Types.Scalars['Boolean']['input'];
}>;


export type GrantProjectPermissionsMutation = { __typename?: 'Mutation', grantProjectPermissions: boolean };


export const GetProjectPermissionsDocument = gql`
    query getProjectPermissions($project: ID!) {
  getProjectPermissions(project: $project) {
    user {
      id
      projectId
      fullname
      username
      email
      role
      createdAt
      updatedAt
      deletedAt
    }
    hasRole
    editable
    role
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