/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from './graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LexiconByKeyQueryVariables = Types.Exact<{
  lexicon: Types.Scalars['String']['input'];
  key: Types.Scalars['String']['input'];
}>;


export type LexiconByKeyQuery = { __typename?: 'Query', lexiconByKey: { __typename?: 'LexiconEntry', key: string, primary: string, video: string, lexicon: string, associates: Array<string>, fields: any } };


export const LexiconByKeyDocument = gql`
    query lexiconByKey($lexicon: String!, $key: String!) {
  lexiconByKey(lexicon: $lexicon, key: $key) {
    key
    primary
    video
    lexicon
    associates
    fields
  }
}
    `;

/**
 * __useLexiconByKeyQuery__
 *
 * To run a query within a React component, call `useLexiconByKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useLexiconByKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLexiconByKeyQuery({
 *   variables: {
 *      lexicon: // value for 'lexicon'
 *      key: // value for 'key'
 *   },
 * });
 */
export function useLexiconByKeyQuery(baseOptions: Apollo.QueryHookOptions<LexiconByKeyQuery, LexiconByKeyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LexiconByKeyQuery, LexiconByKeyQueryVariables>(LexiconByKeyDocument, options);
      }
export function useLexiconByKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LexiconByKeyQuery, LexiconByKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LexiconByKeyQuery, LexiconByKeyQueryVariables>(LexiconByKeyDocument, options);
        }
export type LexiconByKeyQueryHookResult = ReturnType<typeof useLexiconByKeyQuery>;
export type LexiconByKeyLazyQueryHookResult = ReturnType<typeof useLexiconByKeyLazyQuery>;
export type LexiconByKeyQueryResult = Apollo.QueryResult<LexiconByKeyQuery, LexiconByKeyQueryVariables>;