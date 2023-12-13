/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateUploadSessionMutationVariables = Types.Exact<{
  dataset: Types.Scalars['ID']['input'];
}>;


export type CreateUploadSessionMutation = { __typename?: 'Mutation', createUploadSession: { __typename?: 'UploadSession', dataset: string, created: any } };


export const CreateUploadSessionDocument = gql`
    mutation createUploadSession($dataset: ID!) {
  createUploadSession(dataset: $dataset) {
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