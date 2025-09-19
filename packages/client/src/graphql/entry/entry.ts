/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EntryForDatasetQueryVariables = Types.Exact<{
  dataset: Types.Scalars['ID']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type EntryForDatasetQuery = { __typename?: 'Query', entryForDataset: Array<{ __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, dataset: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number, isTraining: boolean }> };

export type EntryFromIdQueryVariables = Types.Exact<{
  entry: Types.Scalars['ID']['input'];
}>;


export type EntryFromIdQuery = { __typename?: 'Query', entryFromID: { __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, dataset: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number, isTraining: boolean } };

export type DeleteEntryMutationVariables = Types.Exact<{
  entry: Types.Scalars['ID']['input'];
}>;


export type DeleteEntryMutation = { __typename?: 'Mutation', deleteEntry: boolean };


export const EntryForDatasetDocument = gql`
    query entryForDataset($dataset: ID!, $page: Int, $pageSize: Int) {
  entryForDataset(dataset: $dataset, page: $page, pageSize: $pageSize) {
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
    isTraining
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
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
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
export const EntryFromIdDocument = gql`
    query entryFromID($entry: ID!) {
  entryFromID(entry: $entry) {
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
    isTraining
  }
}
    `;

/**
 * __useEntryFromIdQuery__
 *
 * To run a query within a React component, call `useEntryFromIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntryFromIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntryFromIdQuery({
 *   variables: {
 *      entry: // value for 'entry'
 *   },
 * });
 */
export function useEntryFromIdQuery(baseOptions: Apollo.QueryHookOptions<EntryFromIdQuery, EntryFromIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntryFromIdQuery, EntryFromIdQueryVariables>(EntryFromIdDocument, options);
      }
export function useEntryFromIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntryFromIdQuery, EntryFromIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntryFromIdQuery, EntryFromIdQueryVariables>(EntryFromIdDocument, options);
        }
export type EntryFromIdQueryHookResult = ReturnType<typeof useEntryFromIdQuery>;
export type EntryFromIdLazyQueryHookResult = ReturnType<typeof useEntryFromIdLazyQuery>;
export type EntryFromIdQueryResult = Apollo.QueryResult<EntryFromIdQuery, EntryFromIdQueryVariables>;
export const DeleteEntryDocument = gql`
    mutation deleteEntry($entry: ID!) {
  deleteEntry(entry: $entry)
}
    `;
export type DeleteEntryMutationFn = Apollo.MutationFunction<DeleteEntryMutation, DeleteEntryMutationVariables>;

/**
 * __useDeleteEntryMutation__
 *
 * To run a mutation, you first call `useDeleteEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEntryMutation, { data, loading, error }] = useDeleteEntryMutation({
 *   variables: {
 *      entry: // value for 'entry'
 *   },
 * });
 */
export function useDeleteEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEntryMutation, DeleteEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEntryMutation, DeleteEntryMutationVariables>(DeleteEntryDocument, options);
      }
export type DeleteEntryMutationHookResult = ReturnType<typeof useDeleteEntryMutation>;
export type DeleteEntryMutationResult = Apollo.MutationResult<DeleteEntryMutation>;
export type DeleteEntryMutationOptions = Apollo.BaseMutationOptions<DeleteEntryMutation, DeleteEntryMutationVariables>;