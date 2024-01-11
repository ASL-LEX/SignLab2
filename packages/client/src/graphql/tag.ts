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

export type AssignTagMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type AssignTagMutation = { __typename?: 'Mutation', assignTag?: { __typename?: 'Tag', _id: string, entry: { __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, dataset: string, creator: string, dateCreated: any, meta: any, signedUrl: string, signedUrlExpiration: number } } | null };

export type CompleteTagMutationVariables = Types.Exact<{
  tag: Types.Scalars['ID']['input'];
  data: Types.Scalars['JSON']['input'];
}>;


export type CompleteTagMutation = { __typename?: 'Mutation', completeTag: boolean };


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
export const AssignTagDocument = gql`
    mutation assignTag($study: ID!) {
  assignTag(study: $study) {
    _id
    entry {
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
}
    `;
export type AssignTagMutationFn = Apollo.MutationFunction<AssignTagMutation, AssignTagMutationVariables>;

/**
 * __useAssignTagMutation__
 *
 * To run a mutation, you first call `useAssignTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignTagMutation, { data, loading, error }] = useAssignTagMutation({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useAssignTagMutation(baseOptions?: Apollo.MutationHookOptions<AssignTagMutation, AssignTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignTagMutation, AssignTagMutationVariables>(AssignTagDocument, options);
      }
export type AssignTagMutationHookResult = ReturnType<typeof useAssignTagMutation>;
export type AssignTagMutationResult = Apollo.MutationResult<AssignTagMutation>;
export type AssignTagMutationOptions = Apollo.BaseMutationOptions<AssignTagMutation, AssignTagMutationVariables>;
export const CompleteTagDocument = gql`
    mutation completeTag($tag: ID!, $data: JSON!) {
  completeTag(tag: $tag, data: $data)
}
    `;
export type CompleteTagMutationFn = Apollo.MutationFunction<CompleteTagMutation, CompleteTagMutationVariables>;

/**
 * __useCompleteTagMutation__
 *
 * To run a mutation, you first call `useCompleteTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeTagMutation, { data, loading, error }] = useCompleteTagMutation({
 *   variables: {
 *      tag: // value for 'tag'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCompleteTagMutation(baseOptions?: Apollo.MutationHookOptions<CompleteTagMutation, CompleteTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteTagMutation, CompleteTagMutationVariables>(CompleteTagDocument, options);
      }
export type CompleteTagMutationHookResult = ReturnType<typeof useCompleteTagMutation>;
export type CompleteTagMutationResult = Apollo.MutationResult<CompleteTagMutation>;
export type CompleteTagMutationOptions = Apollo.BaseMutationOptions<CompleteTagMutation, CompleteTagMutationVariables>;