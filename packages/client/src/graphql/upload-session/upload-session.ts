/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateUploadSessionMutationVariables = Types.Exact<{
  dataset: Types.Scalars['ID']['input'];
}>;


export type CreateUploadSessionMutation = { __typename?: 'Mutation', createUploadSession: { __typename?: 'UploadSession', _id: string, dataset: string, created: any } };

export type GetCsvUploadUrlQueryVariables = Types.Exact<{
  session: Types.Scalars['ID']['input'];
}>;


export type GetCsvUploadUrlQuery = { __typename?: 'Query', getCSVUploadURL: string };

export type ValidateCsvQueryVariables = Types.Exact<{
  session: Types.Scalars['ID']['input'];
}>;


export type ValidateCsvQuery = { __typename?: 'Query', validateCSV: { __typename?: 'UploadResult', success: boolean, message?: string | null } };

export type GetEntryUploadUrlQueryVariables = Types.Exact<{
  session: Types.Scalars['ID']['input'];
  filename: Types.Scalars['String']['input'];
  contentType: Types.Scalars['String']['input'];
}>;


export type GetEntryUploadUrlQuery = { __typename?: 'Query', getEntryUploadURL: string };

export type CompleteUploadSessionMutationVariables = Types.Exact<{
  session: Types.Scalars['ID']['input'];
}>;


export type CompleteUploadSessionMutation = { __typename?: 'Mutation', completeUploadSession: { __typename?: 'UploadResult', success: boolean, message?: string | null } };


export const CreateUploadSessionDocument = gql`
    mutation createUploadSession($dataset: ID!) {
  createUploadSession(dataset: $dataset) {
    _id
    dataset
    created
  }
}
    `;
export type CreateUploadSessionMutationFn = Apollo.MutationFunction<CreateUploadSessionMutation, CreateUploadSessionMutationVariables>;

/**
 * __useCreateUploadSessionMutation__
 *
 * To run a mutation, you first call `useCreateUploadSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUploadSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUploadSessionMutation, { data, loading, error }] = useCreateUploadSessionMutation({
 *   variables: {
 *      dataset: // value for 'dataset'
 *   },
 * });
 */
export function useCreateUploadSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateUploadSessionMutation, CreateUploadSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUploadSessionMutation, CreateUploadSessionMutationVariables>(CreateUploadSessionDocument, options);
      }
export type CreateUploadSessionMutationHookResult = ReturnType<typeof useCreateUploadSessionMutation>;
export type CreateUploadSessionMutationResult = Apollo.MutationResult<CreateUploadSessionMutation>;
export type CreateUploadSessionMutationOptions = Apollo.BaseMutationOptions<CreateUploadSessionMutation, CreateUploadSessionMutationVariables>;
export const GetCsvUploadUrlDocument = gql`
    query getCSVUploadURL($session: ID!) {
  getCSVUploadURL(session: $session)
}
    `;

/**
 * __useGetCsvUploadUrlQuery__
 *
 * To run a query within a React component, call `useGetCsvUploadUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCsvUploadUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCsvUploadUrlQuery({
 *   variables: {
 *      session: // value for 'session'
 *   },
 * });
 */
export function useGetCsvUploadUrlQuery(baseOptions: Apollo.QueryHookOptions<GetCsvUploadUrlQuery, GetCsvUploadUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCsvUploadUrlQuery, GetCsvUploadUrlQueryVariables>(GetCsvUploadUrlDocument, options);
      }
export function useGetCsvUploadUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCsvUploadUrlQuery, GetCsvUploadUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCsvUploadUrlQuery, GetCsvUploadUrlQueryVariables>(GetCsvUploadUrlDocument, options);
        }
export type GetCsvUploadUrlQueryHookResult = ReturnType<typeof useGetCsvUploadUrlQuery>;
export type GetCsvUploadUrlLazyQueryHookResult = ReturnType<typeof useGetCsvUploadUrlLazyQuery>;
export type GetCsvUploadUrlQueryResult = Apollo.QueryResult<GetCsvUploadUrlQuery, GetCsvUploadUrlQueryVariables>;
export const ValidateCsvDocument = gql`
    query validateCSV($session: ID!) {
  validateCSV(session: $session) {
    success
    message
  }
}
    `;

/**
 * __useValidateCsvQuery__
 *
 * To run a query within a React component, call `useValidateCsvQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidateCsvQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidateCsvQuery({
 *   variables: {
 *      session: // value for 'session'
 *   },
 * });
 */
export function useValidateCsvQuery(baseOptions: Apollo.QueryHookOptions<ValidateCsvQuery, ValidateCsvQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ValidateCsvQuery, ValidateCsvQueryVariables>(ValidateCsvDocument, options);
      }
export function useValidateCsvLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ValidateCsvQuery, ValidateCsvQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ValidateCsvQuery, ValidateCsvQueryVariables>(ValidateCsvDocument, options);
        }
export type ValidateCsvQueryHookResult = ReturnType<typeof useValidateCsvQuery>;
export type ValidateCsvLazyQueryHookResult = ReturnType<typeof useValidateCsvLazyQuery>;
export type ValidateCsvQueryResult = Apollo.QueryResult<ValidateCsvQuery, ValidateCsvQueryVariables>;
export const GetEntryUploadUrlDocument = gql`
    query getEntryUploadURL($session: ID!, $filename: String!, $contentType: String!) {
  getEntryUploadURL(
    session: $session
    filename: $filename
    contentType: $contentType
  )
}
    `;

/**
 * __useGetEntryUploadUrlQuery__
 *
 * To run a query within a React component, call `useGetEntryUploadUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntryUploadUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntryUploadUrlQuery({
 *   variables: {
 *      session: // value for 'session'
 *      filename: // value for 'filename'
 *      contentType: // value for 'contentType'
 *   },
 * });
 */
export function useGetEntryUploadUrlQuery(baseOptions: Apollo.QueryHookOptions<GetEntryUploadUrlQuery, GetEntryUploadUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEntryUploadUrlQuery, GetEntryUploadUrlQueryVariables>(GetEntryUploadUrlDocument, options);
      }
export function useGetEntryUploadUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEntryUploadUrlQuery, GetEntryUploadUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEntryUploadUrlQuery, GetEntryUploadUrlQueryVariables>(GetEntryUploadUrlDocument, options);
        }
export type GetEntryUploadUrlQueryHookResult = ReturnType<typeof useGetEntryUploadUrlQuery>;
export type GetEntryUploadUrlLazyQueryHookResult = ReturnType<typeof useGetEntryUploadUrlLazyQuery>;
export type GetEntryUploadUrlQueryResult = Apollo.QueryResult<GetEntryUploadUrlQuery, GetEntryUploadUrlQueryVariables>;
export const CompleteUploadSessionDocument = gql`
    mutation completeUploadSession($session: ID!) {
  completeUploadSession(session: $session) {
    success
    message
  }
}
    `;
export type CompleteUploadSessionMutationFn = Apollo.MutationFunction<CompleteUploadSessionMutation, CompleteUploadSessionMutationVariables>;

/**
 * __useCompleteUploadSessionMutation__
 *
 * To run a mutation, you first call `useCompleteUploadSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteUploadSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeUploadSessionMutation, { data, loading, error }] = useCompleteUploadSessionMutation({
 *   variables: {
 *      session: // value for 'session'
 *   },
 * });
 */
export function useCompleteUploadSessionMutation(baseOptions?: Apollo.MutationHookOptions<CompleteUploadSessionMutation, CompleteUploadSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteUploadSessionMutation, CompleteUploadSessionMutationVariables>(CompleteUploadSessionDocument, options);
      }
export type CompleteUploadSessionMutationHookResult = ReturnType<typeof useCompleteUploadSessionMutation>;
export type CompleteUploadSessionMutationResult = Apollo.MutationResult<CompleteUploadSessionMutation>;
export type CompleteUploadSessionMutationOptions = Apollo.BaseMutationOptions<CompleteUploadSessionMutation, CompleteUploadSessionMutationVariables>;