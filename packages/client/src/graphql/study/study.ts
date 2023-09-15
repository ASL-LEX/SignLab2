/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FindStudiesQueryVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
}>;


export type FindStudiesQuery = { __typename?: 'Query', findStudies: Array<{ __typename?: 'Study', _id: string, name: string, description: string, instructions: string, project: string, tagsPerEntry: number, tagSchema: { __typename?: 'TagSchema', dataSchema: any, uiSchema: any } }> };


export const FindStudiesDocument = gql`
    query findStudies($project: ID!) {
  findStudies(project: $project) {
    _id
    name
    description
    instructions
    project
    tagsPerEntry
    tagSchema {
      dataSchema
      uiSchema
    }
  }
}
    `;

/**
 * __useFindStudiesQuery__
 *
 * To run a query within a React component, call `useFindStudiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindStudiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindStudiesQuery({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useFindStudiesQuery(baseOptions: Apollo.QueryHookOptions<FindStudiesQuery, FindStudiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindStudiesQuery, FindStudiesQueryVariables>(FindStudiesDocument, options);
      }
export function useFindStudiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindStudiesQuery, FindStudiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindStudiesQuery, FindStudiesQueryVariables>(FindStudiesDocument, options);
        }
export type FindStudiesQueryHookResult = ReturnType<typeof useFindStudiesQuery>;
export type FindStudiesLazyQueryHookResult = ReturnType<typeof useFindStudiesLazyQuery>;
export type FindStudiesQueryResult = Apollo.QueryResult<FindStudiesQuery, FindStudiesQueryVariables>;