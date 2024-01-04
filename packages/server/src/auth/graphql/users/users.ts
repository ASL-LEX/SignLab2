/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type UsersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'UserModel', id: string, projectId: string, username?: string | null, fullname?: string | null, email?: string | null, role: number, createdAt: any, updatedAt: any, deletedAt?: any | null }> };


export const UsersDocument = gql`
    query users {
  users {
    id
    projectId
    username
    fullname
    email
    role
    createdAt
    updatedAt
    deletedAt
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    users(variables?: UsersQueryVariables, options?: C): Promise<UsersQuery> {
      return requester<UsersQuery, UsersQueryVariables>(UsersDocument, variables, options) as Promise<UsersQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;