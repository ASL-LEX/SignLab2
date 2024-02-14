/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateTagsMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entries: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CreateTagsMutation = { __typename?: 'Mutation', createTags: Array<{ __typename?: 'Tag', _id: string }> };

export type SetEntryEnabledMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entry: Types.Scalars['ID']['input'];
  enabled: Types.Scalars['Boolean']['input'];
}>;


export type SetEntryEnabledMutation = { __typename?: 'Mutation', setEntryEnabled: boolean };

export type IsEntryEnabledQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entry: Types.Scalars['ID']['input'];
}>;


export type IsEntryEnabledQuery = { __typename?: 'Query', isEntryEnabled: boolean };

export type AssignTagMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type AssignTagMutation = { __typename?: 'Mutation', assignTag?: { __typename?: 'Tag', _id: string, entry: { __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, dataset: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number } } | null };

export type CompleteTagMutationVariables = Types.Exact<{
  tag: Types.Scalars['ID']['input'];
  data: Types.Scalars['JSON']['input'];
}>;


export type CompleteTagMutation = { __typename?: 'Mutation', completeTag: boolean };

export type SaveVideoFieldMutationVariables = Types.Exact<{
  tag: Types.Scalars['ID']['input'];
  field: Types.Scalars['String']['input'];
  index: Types.Scalars['Int']['input'];
}>;


export type SaveVideoFieldMutation = { __typename?: 'Mutation', saveVideoField: { __typename?: 'VideoField', _id: string, uploadURL: string } };


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
export const SetEntryEnabledDocument = gql`
    mutation setEntryEnabled($study: ID!, $entry: ID!, $enabled: Boolean!) {
  setEntryEnabled(study: $study, entry: $entry, enabled: $enabled)
}
    `;
export type SetEntryEnabledMutationFn = Apollo.MutationFunction<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>;

/**
 * __useSetEntryEnabledMutation__
 *
 * To run a mutation, you first call `useSetEntryEnabledMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetEntryEnabledMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setEntryEnabledMutation, { data, loading, error }] = useSetEntryEnabledMutation({
 *   variables: {
 *      study: // value for 'study'
 *      entry: // value for 'entry'
 *      enabled: // value for 'enabled'
 *   },
 * });
 */
export function useSetEntryEnabledMutation(baseOptions?: Apollo.MutationHookOptions<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>(SetEntryEnabledDocument, options);
      }
export type SetEntryEnabledMutationHookResult = ReturnType<typeof useSetEntryEnabledMutation>;
export type SetEntryEnabledMutationResult = Apollo.MutationResult<SetEntryEnabledMutation>;
export type SetEntryEnabledMutationOptions = Apollo.BaseMutationOptions<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>;
export const IsEntryEnabledDocument = gql`
    query isEntryEnabled($study: ID!, $entry: ID!) {
  isEntryEnabled(study: $study, entry: $entry)
}
    `;

/**
 * __useIsEntryEnabledQuery__
 *
 * To run a query within a React component, call `useIsEntryEnabledQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsEntryEnabledQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsEntryEnabledQuery({
 *   variables: {
 *      study: // value for 'study'
 *      entry: // value for 'entry'
 *   },
 * });
 */
export function useIsEntryEnabledQuery(baseOptions: Apollo.QueryHookOptions<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>(IsEntryEnabledDocument, options);
      }
export function useIsEntryEnabledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>(IsEntryEnabledDocument, options);
        }
export type IsEntryEnabledQueryHookResult = ReturnType<typeof useIsEntryEnabledQuery>;
export type IsEntryEnabledLazyQueryHookResult = ReturnType<typeof useIsEntryEnabledLazyQuery>;
export type IsEntryEnabledQueryResult = Apollo.QueryResult<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>;
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
export const SaveVideoFieldDocument = gql`
    mutation saveVideoField($tag: ID!, $field: String!, $index: Int!) {
  saveVideoField(tag: $tag, field: $field, index: $index) {
    _id
    uploadURL
  }
}
    `;
export type SaveVideoFieldMutationFn = Apollo.MutationFunction<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>;

/**
 * __useSaveVideoFieldMutation__
 *
 * To run a mutation, you first call `useSaveVideoFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveVideoFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveVideoFieldMutation, { data, loading, error }] = useSaveVideoFieldMutation({
 *   variables: {
 *      tag: // value for 'tag'
 *      field: // value for 'field'
 *      index: // value for 'index'
 *   },
 * });
 */
export function useSaveVideoFieldMutation(baseOptions?: Apollo.MutationHookOptions<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>(SaveVideoFieldDocument, options);
      }
export type SaveVideoFieldMutationHookResult = ReturnType<typeof useSaveVideoFieldMutation>;
export type SaveVideoFieldMutationResult = Apollo.MutationResult<SaveVideoFieldMutation>;
export type SaveVideoFieldMutationOptions = Apollo.BaseMutationOptions<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>;