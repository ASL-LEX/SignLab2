/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetOrganizationsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename?: 'Query', getOrganizations: Array<{ __typename?: 'Organization', _id: string, name: string, authURL: string, tenantID: string }> };

export type GetOrganizationFromTenantQueryVariables = Types.Exact<{
  tenant: Types.Scalars['String']['input'];
}>;


export type GetOrganizationFromTenantQuery = { __typename?: 'Query', getOrganizationFromTenant: { __typename?: 'Organization', _id: string, name: string, authURL: string, tenantID: string } };


export const GetOrganizationsDocument = gql`
    query getOrganizations {
  getOrganizations {
    _id
    name
    authURL
    tenantID
  }
}
    `;

/**
 * __useGetOrganizationsQuery__
 *
 * To run a query within a React component, call `useGetOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
      }
export function useGetOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
        }
export type GetOrganizationsQueryHookResult = ReturnType<typeof useGetOrganizationsQuery>;
export type GetOrganizationsLazyQueryHookResult = ReturnType<typeof useGetOrganizationsLazyQuery>;
export type GetOrganizationsQueryResult = Apollo.QueryResult<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetOrganizationFromTenantDocument = gql`
    query getOrganizationFromTenant($tenant: String!) {
  getOrganizationFromTenant(tenant: $tenant) {
    _id
    name
    authURL
    tenantID
  }
}
    `;

/**
 * __useGetOrganizationFromTenantQuery__
 *
 * To run a query within a React component, call `useGetOrganizationFromTenantQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganizationFromTenantQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganizationFromTenantQuery({
 *   variables: {
 *      tenant: // value for 'tenant'
 *   },
 * });
 */
export function useGetOrganizationFromTenantQuery(baseOptions: Apollo.QueryHookOptions<GetOrganizationFromTenantQuery, GetOrganizationFromTenantQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrganizationFromTenantQuery, GetOrganizationFromTenantQueryVariables>(GetOrganizationFromTenantDocument, options);
      }
export function useGetOrganizationFromTenantLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrganizationFromTenantQuery, GetOrganizationFromTenantQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrganizationFromTenantQuery, GetOrganizationFromTenantQueryVariables>(GetOrganizationFromTenantDocument, options);
        }
export type GetOrganizationFromTenantQueryHookResult = ReturnType<typeof useGetOrganizationFromTenantQuery>;
export type GetOrganizationFromTenantLazyQueryHookResult = ReturnType<typeof useGetOrganizationFromTenantLazyQuery>;
export type GetOrganizationFromTenantQueryResult = Apollo.QueryResult<GetOrganizationFromTenantQuery, GetOrganizationFromTenantQueryVariables>;