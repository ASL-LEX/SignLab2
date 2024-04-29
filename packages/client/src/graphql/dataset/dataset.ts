/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetDatasetsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDatasetsQuery = { __typename?: 'Query', getDatasets: Array<{ __typename?: 'Dataset', _id: string, name: string, description: string }> };

export type DatasetExistsQueryVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
}>;


export type DatasetExistsQuery = { __typename?: 'Query', datasetExists: boolean };

export type GetDatasetsByProjectQueryVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
}>;


export type GetDatasetsByProjectQuery = { __typename?: 'Query', getDatasetsByProject: Array<{ __typename?: 'Dataset', _id: string, name: string, description: string }> };

export type CreateDatasetMutationVariables = Types.Exact<{
  dataset: Types.DatasetCreate;
}>;


export type CreateDatasetMutation = { __typename?: 'Mutation', createDataset: { __typename?: 'Dataset', _id: string, name: string, description: string } };

export type CreateDatasetDownloadMutationVariables = Types.Exact<{
  downloadRequest: Types.CreateDatasetDownloadRequest;
}>;


export type CreateDatasetDownloadMutation = { __typename?: 'Mutation', createDatasetDownload: { __typename?: 'DatasetDownloadRequest', date: any, status: Types.DownloadStatus } };


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
export const DatasetExistsDocument = gql`
    query datasetExists($name: String!) {
  datasetExists(name: $name)
}
    `;

/**
 * __useDatasetExistsQuery__
 *
 * To run a query within a React component, call `useDatasetExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetExistsQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDatasetExistsQuery(baseOptions: Apollo.QueryHookOptions<DatasetExistsQuery, DatasetExistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DatasetExistsQuery, DatasetExistsQueryVariables>(DatasetExistsDocument, options);
      }
export function useDatasetExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DatasetExistsQuery, DatasetExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DatasetExistsQuery, DatasetExistsQueryVariables>(DatasetExistsDocument, options);
        }
export type DatasetExistsQueryHookResult = ReturnType<typeof useDatasetExistsQuery>;
export type DatasetExistsLazyQueryHookResult = ReturnType<typeof useDatasetExistsLazyQuery>;
export type DatasetExistsQueryResult = Apollo.QueryResult<DatasetExistsQuery, DatasetExistsQueryVariables>;
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
export const CreateDatasetDocument = gql`
    mutation createDataset($dataset: DatasetCreate!) {
  createDataset(dataset: $dataset) {
    _id
    name
    description
  }
}
    `;
export type CreateDatasetMutationFn = Apollo.MutationFunction<CreateDatasetMutation, CreateDatasetMutationVariables>;

/**
 * __useCreateDatasetMutation__
 *
 * To run a mutation, you first call `useCreateDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatasetMutation, { data, loading, error }] = useCreateDatasetMutation({
 *   variables: {
 *      dataset: // value for 'dataset'
 *   },
 * });
 */
export function useCreateDatasetMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatasetMutation, CreateDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatasetMutation, CreateDatasetMutationVariables>(CreateDatasetDocument, options);
      }
export type CreateDatasetMutationHookResult = ReturnType<typeof useCreateDatasetMutation>;
export type CreateDatasetMutationResult = Apollo.MutationResult<CreateDatasetMutation>;
export type CreateDatasetMutationOptions = Apollo.BaseMutationOptions<CreateDatasetMutation, CreateDatasetMutationVariables>;
export const CreateDatasetDownloadDocument = gql`
    mutation createDatasetDownload($downloadRequest: CreateDatasetDownloadRequest!) {
  createDatasetDownload(downloadRequest: $downloadRequest) {
    date
    status
  }
}
    `;
export type CreateDatasetDownloadMutationFn = Apollo.MutationFunction<CreateDatasetDownloadMutation, CreateDatasetDownloadMutationVariables>;

/**
 * __useCreateDatasetDownloadMutation__
 *
 * To run a mutation, you first call `useCreateDatasetDownloadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatasetDownloadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatasetDownloadMutation, { data, loading, error }] = useCreateDatasetDownloadMutation({
 *   variables: {
 *      downloadRequest: // value for 'downloadRequest'
 *   },
 * });
 */
export function useCreateDatasetDownloadMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatasetDownloadMutation, CreateDatasetDownloadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatasetDownloadMutation, CreateDatasetDownloadMutationVariables>(CreateDatasetDownloadDocument, options);
      }
export type CreateDatasetDownloadMutationHookResult = ReturnType<typeof useCreateDatasetDownloadMutation>;
export type CreateDatasetDownloadMutationResult = Apollo.MutationResult<CreateDatasetDownloadMutation>;
export type CreateDatasetDownloadMutationOptions = Apollo.BaseMutationOptions<CreateDatasetDownloadMutation, CreateDatasetDownloadMutationVariables>;