/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetDatasetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDatasetsQuery = { __typename?: 'Query', getDatasets: Array<{ __typename?: 'Dataset', _id: string, name: string, description: string }> };

export type GetDatasetsByProjectQueryVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
}>;


export type GetDatasetsByProjectQuery = { __typename?: 'Query', getDatasetsByProject: Array<{ __typename?: 'Dataset', _id: string, name: string, description: string }> };


export const GetDatasetsDocument = gql`
    query getDatasets {
  getDatasets {
    _id
    name
    description
  }
}
    `;

/**
 * __useGetDatasetsQuery__
 *
 * To run a query within a React component, call `useGetDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDatasetsQuery(baseOptions?: Apollo.QueryHookOptions<GetDatasetsQuery, GetDatasetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(GetDatasetsDocument, options);
      }
export function useGetDatasetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDatasetsQuery, GetDatasetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(GetDatasetsDocument, options);
        }
export type GetDatasetsQueryHookResult = ReturnType<typeof useGetDatasetsQuery>;
export type GetDatasetsLazyQueryHookResult = ReturnType<typeof useGetDatasetsLazyQuery>;
export type GetDatasetsQueryResult = Apollo.QueryResult<GetDatasetsQuery, GetDatasetsQueryVariables>;
export const GetDatasetsByProjectDocument = gql`
    query getDatasetsByProject($project: ID!) {
  getDatasetsByProject(project: $project) {
    _id
    name
    description
  }
}
    `;

/**
 * __useGetDatasetsByProjectQuery__
 *
 * To run a query within a React component, call `useGetDatasetsByProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetsByProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetsByProjectQuery({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useGetDatasetsByProjectQuery(baseOptions: Apollo.QueryHookOptions<GetDatasetsByProjectQuery, GetDatasetsByProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDatasetsByProjectQuery, GetDatasetsByProjectQueryVariables>(GetDatasetsByProjectDocument, options);
      }
export function useGetDatasetsByProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDatasetsByProjectQuery, GetDatasetsByProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDatasetsByProjectQuery, GetDatasetsByProjectQueryVariables>(GetDatasetsByProjectDocument, options);
        }
export type GetDatasetsByProjectQueryHookResult = ReturnType<typeof useGetDatasetsByProjectQuery>;
export type GetDatasetsByProjectLazyQueryHookResult = ReturnType<typeof useGetDatasetsByProjectLazyQuery>;
export type GetDatasetsByProjectQueryResult = Apollo.QueryResult<GetDatasetsByProjectQuery, GetDatasetsByProjectQueryVariables>;