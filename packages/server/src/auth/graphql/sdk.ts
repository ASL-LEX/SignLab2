/* Generated File DO NOT EDIT. */
/* tslint:disable */
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type ProjectUsersQueryVariables = Exact<{
  projectId: Scalars['String']['input'];
}>;


export type ProjectUsersQuery = { __typename?: 'Query', projectUsers: Array<{ __typename?: 'UserModel', id: string, projectId: string, username?: string | null, fullname?: string | null, email?: string | null, role: number, createdAt: any, updatedAt: any, deletedAt?: any | null }> };


export const ProjectUsersDocument = gql`
    query projectUsers($projectId: String!) {
  projectUsers(projectId: $projectId) {
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
    projectUsers(variables: ProjectUsersQueryVariables, options?: C): Promise<ProjectUsersQuery> {
      return requester<ProjectUsersQuery, ProjectUsersQueryVariables>(ProjectUsersDocument, variables, options) as Promise<ProjectUsersQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;