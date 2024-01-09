/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from './graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateTagsMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entries: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CreateTagsMutation = { __typename?: 'Mutation', createTags: Array<{ __typename?: 'Tag', _id: string }> };


export const CreateTagsDocument = gql`
    mutation createTags($study: ID!, $entries: [ID!]!) {
  createTags(study: $study, entries: $entries) {
    _id
  }
}
    `;
export type CreateTagsMutationFn = Apollo.MutationFunction<CreateTagsMutation, CreateTagsMutationVariables>;

/**
 * __useCreateTagsMutation__
 *
 * To run a mutation, you first call `useCreateTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagsMutation, { data, loading, error }] = useCreateTagsMutation({
 *   variables: {
 *      study: // value for 'study'
 *      entries: // value for 'entries'
 *   },
 * });
 */
export function useCreateTagsMutation(baseOptions?: Apollo.MutationHookOptions<CreateTagsMutation, CreateTagsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTagsMutation, CreateTagsMutationVariables>(CreateTagsDocument, options);
      }
export type CreateTagsMutationHookResult = ReturnType<typeof useCreateTagsMutation>;
export type CreateTagsMutationResult = Apollo.MutationResult<CreateTagsMutation>;
export type CreateTagsMutationOptions = Apollo.BaseMutationOptions<CreateTagsMutation, CreateTagsMutationVariables>;