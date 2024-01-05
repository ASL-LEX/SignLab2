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