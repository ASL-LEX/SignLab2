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


export type ValidateCsvQuery = { __typename?: 'Query', validateCSV: boolean };


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
  validateCSV(session: $session)
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