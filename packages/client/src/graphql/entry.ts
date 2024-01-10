/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from './graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntryForDatasetQueryVariables = Types.Exact<{
  dataset: Types.Scalars['ID']['input'];
}>;


export type EntryForDatasetQuery = { __typename?: 'Query', entryForDataset: Array<{ __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, dataset: string, creator: string, dateCreated: any, meta: any, signedUrl: string, signedUrlExpiration: number }> };


export const EntryForDatasetDocument = gql`
    query entryForDataset($dataset: ID!) {
  entryForDataset(dataset: $dataset) {
    _id
    organization
    entryID
    contentType
    dataset
    creator
    dateCreated
    meta
    signedUrl
    signedUrlExpiration
  }
}
    `;

/**
 * __useEntryForDatasetQuery__
 *
 * To run a query within a React component, call `useEntryForDatasetQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntryForDatasetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntryForDatasetQuery({
 *   variables: {
 *      dataset: // value for 'dataset'
 *   },
 * });
 */
export function useEntryForDatasetQuery(baseOptions: Apollo.QueryHookOptions<EntryForDatasetQuery, EntryForDatasetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntryForDatasetQuery, EntryForDatasetQueryVariables>(EntryForDatasetDocument, options);
      }
export function useEntryForDatasetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntryForDatasetQuery, EntryForDatasetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntryForDatasetQuery, EntryForDatasetQueryVariables>(EntryForDatasetDocument, options);
        }
export type EntryForDatasetQueryHookResult = ReturnType<typeof useEntryForDatasetQuery>;
export type EntryForDatasetLazyQueryHookResult = ReturnType<typeof useEntryForDatasetLazyQuery>;
export type EntryForDatasetQueryResult = Apollo.QueryResult<EntryForDatasetQuery, EntryForDatasetQueryVariables>;