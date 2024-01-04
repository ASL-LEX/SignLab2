/* Generated File DO NOT EDIT. */
/* tslint:disable */
import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  _Any: { input: any; output: any; }
  federation__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

/** Input type for accepting an invite */
export type AcceptInviteModel = {
  /** The email address of the user accepting the invite */
  email: Scalars['String']['input'];
  /** The full name of the user accepting the invite */
  fullname: Scalars['String']['input'];
  /** The invite code that was included in the invite email */
  inviteCode: Scalars['String']['input'];
  /** The password for the new user account */
  password: Scalars['String']['input'];
  /** The ID of the project the invite is associated with */
  projectId: Scalars['String']['input'];
};

export type AccessToken = {
  __typename?: 'AccessToken';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type ConfigurableProjectSettings = {
  description?: InputMaybe<Scalars['String']['input']>;
  homePage?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  muiTheme?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  redirectUrl?: InputMaybe<Scalars['String']['input']>;
};

export type EmailLoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type ForgotDto = {
  email: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type GoogleLoginDto = {
  credential: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type InviteModel = {
  __typename?: 'InviteModel';
  /** The date and time at which the invitation was created. */
  createdAt: Scalars['DateTime']['output'];
  /** The date and time at which the invitation was deleted, if applicable. */
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  /** The email address of the user being invited. */
  email: Scalars['String']['output'];
  /** The date and time at which the invitation expires. */
  expiresAt: Scalars['DateTime']['output'];
  /** The ID of the invitation. */
  id: Scalars['ID']['output'];
  /** The ID of the project to which the invitation belongs. */
  projectId: Scalars['String']['output'];
  /** The role that the user being invited will have. */
  role: Scalars['Int']['output'];
  /** The status of the invitation. */
  status: InviteStatus;
  /** The date and time at which the invitation was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

/** The status of an invite */
export enum InviteStatus {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Pending = 'PENDING'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvite: InviteModel;
  cancelInvite: InviteModel;
  createInvite: InviteModel;
  createProject: ProjectModel;
  forgotPassword: Scalars['Boolean']['output'];
  loginEmail: AccessToken;
  loginGoogle: AccessToken;
  loginUsername: AccessToken;
  refresh: AccessToken;
  resendInvite: InviteModel;
  resetPassword: Scalars['Boolean']['output'];
  signup: AccessToken;
  updateProject: ProjectModel;
  updateProjectAuthMethods: ProjectModel;
  updateProjectSettings: ProjectModel;
  updateUser: UserModel;
};


export type MutationAcceptInviteArgs = {
  input: AcceptInviteModel;
};


export type MutationCancelInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateInviteArgs = {
  email: Scalars['String']['input'];
  role?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateProjectArgs = {
  project: ProjectCreateInput;
};


export type MutationForgotPasswordArgs = {
  user: ForgotDto;
};


export type MutationLoginEmailArgs = {
  user: EmailLoginDto;
};


export type MutationLoginGoogleArgs = {
  user: GoogleLoginDto;
};


export type MutationLoginUsernameArgs = {
  user: UsernameLoginDto;
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationResendInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  user: ResetDto;
};


export type MutationSignupArgs = {
  user: UserSignupDto;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['String']['input'];
  settings: ConfigurableProjectSettings;
};


export type MutationUpdateProjectAuthMethodsArgs = {
  id: Scalars['String']['input'];
  projectAuthMethods: ProjectAuthMethodsInput;
};


export type MutationUpdateProjectSettingsArgs = {
  id: Scalars['String']['input'];
  projectSettings: ProjectSettingsInput;
};


export type MutationUpdateUserArgs = {
  email: Scalars['String']['input'];
  fullname: Scalars['String']['input'];
};

export type ProjectAuthMethodsInput = {
  emailAuth?: InputMaybe<Scalars['Boolean']['input']>;
  googleAuth?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectAuthMethodsModel = {
  __typename?: 'ProjectAuthMethodsModel';
  emailAuth: Scalars['Boolean']['output'];
  googleAuth: Scalars['Boolean']['output'];
};

export type ProjectCreateInput = {
  allowSignup?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayProjectName?: InputMaybe<Scalars['Boolean']['input']>;
  emailAuth?: InputMaybe<Scalars['Boolean']['input']>;
  googleAuth?: InputMaybe<Scalars['Boolean']['input']>;
  homePage?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  muiTheme?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  redirectUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  authMethods: ProjectAuthMethodsModel;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  homePage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  muiTheme: Scalars['JSON']['output'];
  name: Scalars['String']['output'];
  redirectUrl?: Maybe<Scalars['String']['output']>;
  settings: ProjectSettingsModel;
  updatedAt: Scalars['DateTime']['output'];
  users: Array<UserModel>;
};

export type ProjectSettingsInput = {
  allowSignup?: InputMaybe<Scalars['Boolean']['input']>;
  displayProjectName?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectSettingsModel = {
  __typename?: 'ProjectSettingsModel';
  allowSignup: Scalars['Boolean']['output'];
  displayProjectName: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  getProject: ProjectModel;
  getUser: UserModel;
  invite: InviteModel;
  invites: Array<InviteModel>;
  listProjects: Array<ProjectModel>;
  me: UserModel;
  projectUsers: Array<UserModel>;
  publicKey: Array<Scalars['String']['output']>;
  users: Array<UserModel>;
};


export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};


export type QueryGetProjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInviteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvitesArgs = {
  status?: InputMaybe<InviteStatus>;
};


export type QueryProjectUsersArgs = {
  projectId: Scalars['String']['input'];
};

export type ResetDto = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fullname?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  projectId: Scalars['String']['output'];
  role: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserSignupDto = {
  email: Scalars['String']['input'];
  fullname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UsernameLoginDto = {
  password: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type _Entity = InviteModel | ProjectModel | UserModel;

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    projectUsers(variables: ProjectUsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ProjectUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProjectUsersQuery>(ProjectUsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'projectUsers', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;