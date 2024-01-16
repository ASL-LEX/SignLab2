/* Generated File DO NOT EDIT. */
/* tslint:disable */
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

export type Dataset = {
  __typename?: 'Dataset';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DatasetCreate = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type DatasetProjectPermission = {
  __typename?: 'DatasetProjectPermission';
  dataset: Dataset;
  projectHasAccess: Scalars['Boolean']['output'];
};

export type EmailLoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type Entry = {
  __typename?: 'Entry';
  _id: Scalars['String']['output'];
  contentType: Scalars['String']['output'];
  creator: Scalars['ID']['output'];
  dataset: Scalars['ID']['output'];
  dateCreated: Scalars['DateTime']['output'];
  entryID: Scalars['String']['output'];
  meta: Scalars['JSON']['output'];
  organization: Scalars['ID']['output'];
  signedUrl: Scalars['String']['output'];
  /** Get the number of milliseconds the signed URL is valid for. */
  signedUrlExpiration: Scalars['Float']['output'];
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

/** Represents an entier lexicon */
export type Lexicon = {
  __typename?: 'Lexicon';
  /** Unique identifier for the lexicon */
  _id: Scalars['ID']['output'];
  /** The name of the Lexicon */
  name: Scalars['String']['output'];
  /** Format each entry in the Lexicon is expected to follow */
  schema: Scalars['JSON']['output'];
};

export type LexiconAddEntry = {
  /** Keywords that are similar to search accross */
  associates: Array<Scalars['String']['input']>;
  /** Fields stored on the entry */
  fields: Scalars['JSON']['input'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key: Scalars['String']['input'];
  lexicon: Scalars['String']['input'];
  /** Primary way to search for entries in the lexicon */
  primary: Scalars['String']['input'];
  /** Link to the video that represents the entry */
  video: Scalars['String']['input'];
};

export type LexiconCreate = {
  /** The name of the Lexicon */
  name: Scalars['String']['input'];
  /** Format each entry in the Lexicon is expected to follow */
  schema: Scalars['JSON']['input'];
};

/** Single entry within a whole lexicon  */
export type LexiconEntry = {
  __typename?: 'LexiconEntry';
  /** Keywords that are similar to search accross */
  associates: Array<Scalars['String']['output']>;
  /** Fields stored on the entry */
  fields: Scalars['JSON']['output'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key: Scalars['String']['output'];
  lexicon: Scalars['String']['output'];
  /** Primary way to search for entries in the lexicon */
  primary: Scalars['String']['output'];
  /** Link to the video that represents the entry */
  video: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvite: InviteModel;
  assignTag?: Maybe<Tag>;
  cancelInvite: InviteModel;
  changeDatasetDescription: Scalars['Boolean']['output'];
  changeDatasetName: Scalars['Boolean']['output'];
  changeStudyDescription: Study;
  changeStudyName: Study;
  completeTag: Scalars['Boolean']['output'];
  completeUploadSession: UploadResult;
  createDataset: Dataset;
  createInvite: InviteModel;
  createOrganization: Organization;
  createProject: ProjectModel;
  createStudy: Study;
  createTags: Array<Tag>;
  createUploadSession: UploadSession;
  deleteEntry: Scalars['Boolean']['output'];
  deleteProject: Scalars['Boolean']['output'];
  deleteStudy: Scalars['Boolean']['output'];
  forgotPassword: Scalars['Boolean']['output'];
  grantContributor: Scalars['Boolean']['output'];
  grantOwner: Scalars['Boolean']['output'];
  grantProjectDatasetAccess: Scalars['Boolean']['output'];
  grantProjectPermissions: Scalars['Boolean']['output'];
  grantStudyAdmin: Scalars['Boolean']['output'];
  grantTrainedContributor: Scalars['Boolean']['output'];
  lexiconAddEntry: LexiconEntry;
  /** Remove all entries from a given lexicon */
  lexiconClearEntries: Scalars['Boolean']['output'];
  lexiconCreate: Lexicon;
  loginEmail: AccessToken;
  loginGoogle: AccessToken;
  loginUsername: AccessToken;
  refresh: AccessToken;
  resendInvite: InviteModel;
  resetPassword: Scalars['Boolean']['output'];
  signLabCreateProject: Project;
  signup: AccessToken;
  updateProject: ProjectModel;
  updateProjectAuthMethods: ProjectModel;
  updateProjectSettings: ProjectModel;
  updateUser: UserModel;
};


export type MutationAcceptInviteArgs = {
  input: AcceptInviteModel;
};


export type MutationAssignTagArgs = {
  study: Scalars['ID']['input'];
};


export type MutationCancelInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationChangeDatasetDescriptionArgs = {
  dataset: Scalars['ID']['input'];
  newDescription: Scalars['String']['input'];
};


export type MutationChangeDatasetNameArgs = {
  dataset: Scalars['ID']['input'];
  newName: Scalars['String']['input'];
};


export type MutationChangeStudyDescriptionArgs = {
  newDescription: Scalars['String']['input'];
  study: Scalars['ID']['input'];
};


export type MutationChangeStudyNameArgs = {
  newName: Scalars['String']['input'];
  study: Scalars['ID']['input'];
};


export type MutationCompleteTagArgs = {
  data: Scalars['JSON']['input'];
  tag: Scalars['ID']['input'];
};


export type MutationCompleteUploadSessionArgs = {
  session: Scalars['ID']['input'];
};


export type MutationCreateDatasetArgs = {
  dataset: DatasetCreate;
};


export type MutationCreateInviteArgs = {
  email: Scalars['String']['input'];
  role?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateOrganizationArgs = {
  organization: OrganizationCreate;
};


export type MutationCreateProjectArgs = {
  project: ProjectCreateInput;
};


export type MutationCreateStudyArgs = {
  study: StudyCreate;
};


export type MutationCreateTagsArgs = {
  entries: Array<Scalars['ID']['input']>;
  study: Scalars['ID']['input'];
};


export type MutationCreateUploadSessionArgs = {
  dataset: Scalars['ID']['input'];
};


export type MutationDeleteEntryArgs = {
  entry: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  project: Scalars['ID']['input'];
};


export type MutationDeleteStudyArgs = {
  study: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  user: ForgotDto;
};


export type MutationGrantContributorArgs = {
  isContributor: Scalars['Boolean']['input'];
  study: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationGrantOwnerArgs = {
  targetUser: Scalars['ID']['input'];
};


export type MutationGrantProjectDatasetAccessArgs = {
  dataset: Scalars['ID']['input'];
  hasAccess: Scalars['Boolean']['input'];
  project: Scalars['ID']['input'];
};


export type MutationGrantProjectPermissionsArgs = {
  isAdmin: Scalars['Boolean']['input'];
  project: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationGrantStudyAdminArgs = {
  isAdmin: Scalars['Boolean']['input'];
  study: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationGrantTrainedContributorArgs = {
  isTrained: Scalars['Boolean']['input'];
  study: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationLexiconAddEntryArgs = {
  entry: LexiconAddEntry;
};


export type MutationLexiconClearEntriesArgs = {
  lexicon: Scalars['String']['input'];
};


export type MutationLexiconCreateArgs = {
  lexicon: LexiconCreate;
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


export type MutationSignLabCreateProjectArgs = {
  project: ProjectCreate;
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

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ID']['output'];
  /** URL where the user logs in against */
  authURL: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type OrganizationCreate = {
  /** URL where the user logs in against */
  authURL: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  contributor: Scalars['Boolean']['output'];
  owner: Scalars['Boolean']['output'];
  projectAdmin: Scalars['Boolean']['output'];
  studyAdmin: Scalars['Boolean']['output'];
  trainedContributor: Scalars['Boolean']['output'];
};

export type Project = {
  __typename?: 'Project';
  _id: Scalars['ID']['output'];
  created: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
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

export type ProjectCreate = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
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

export type ProjectPermissionModel = {
  __typename?: 'ProjectPermissionModel';
  editable: Scalars['Boolean']['output'];
  isProjectAdmin: Scalars['Boolean']['output'];
  user: UserModel;
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
  entryForDataset: Array<Entry>;
  exists: Scalars['Boolean']['output'];
  findStudies: Array<Study>;
  /** Get the presigned URL for where to upload the CSV against */
  getCSVUploadURL: Scalars['String']['output'];
  getDatasetProjectPermissions: Array<DatasetProjectPermission>;
  getDatasets: Array<Dataset>;
  getDatasetsByProject: Array<Dataset>;
  getEntryUploadURL: Scalars['String']['output'];
  getOrganizations: Array<Organization>;
  getProject: ProjectModel;
  getProjectPermissions: Array<ProjectPermissionModel>;
  getProjects: Array<Project>;
  getRoles: Permission;
  getStudyPermissions: Array<StudyPermissionModel>;
  getUser: UserModel;
  invite: InviteModel;
  invites: Array<InviteModel>;
  lexFindAll: Array<Lexicon>;
  lexiconByKey: LexiconEntry;
  lexiconSearch: Array<LexiconEntry>;
  listProjects: Array<ProjectModel>;
  me: UserModel;
  projectExists: Scalars['Boolean']['output'];
  projectUsers: Array<UserModel>;
  publicKey: Array<Scalars['String']['output']>;
  studyExists: Scalars['Boolean']['output'];
  users: Array<UserModel>;
  validateCSV: UploadResult;
};


export type QueryEntryForDatasetArgs = {
  dataset: Scalars['ID']['input'];
};


export type QueryExistsArgs = {
  name: Scalars['String']['input'];
};


export type QueryFindStudiesArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetCsvUploadUrlArgs = {
  session: Scalars['ID']['input'];
};


export type QueryGetDatasetProjectPermissionsArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetDatasetsByProjectArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetEntryUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  session: Scalars['ID']['input'];
};


export type QueryGetProjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetProjectPermissionsArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetRolesArgs = {
  project?: InputMaybe<Scalars['ID']['input']>;
  study?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetStudyPermissionsArgs = {
  study: Scalars['ID']['input'];
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


export type QueryLexiconByKeyArgs = {
  key: Scalars['String']['input'];
  lexicon: Scalars['String']['input'];
};


export type QueryLexiconSearchArgs = {
  lexicon: Scalars['String']['input'];
  search: Scalars['String']['input'];
};


export type QueryProjectExistsArgs = {
  name: Scalars['String']['input'];
};


export type QueryProjectUsersArgs = {
  projectId: Scalars['String']['input'];
};


export type QueryStudyExistsArgs = {
  name: Scalars['String']['input'];
  project: Scalars['ID']['input'];
};


export type QueryValidateCsvArgs = {
  session: Scalars['ID']['input'];
};

export type ResetDto = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};

export type Study = {
  __typename?: 'Study';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  instructions: Scalars['String']['output'];
  name: Scalars['String']['output'];
  project: Scalars['ID']['output'];
  tagSchema: TagSchema;
  tagsPerEntry: Scalars['Float']['output'];
};

export type StudyCreate = {
  description: Scalars['String']['input'];
  instructions: Scalars['String']['input'];
  name: Scalars['String']['input'];
  project: Scalars['ID']['input'];
  tagSchema: TagSchemaInput;
  tagsPerEntry: Scalars['Float']['input'];
};

export type StudyPermissionModel = {
  __typename?: 'StudyPermissionModel';
  isContributor: Scalars['Boolean']['output'];
  isContributorEditable: Scalars['Boolean']['output'];
  isStudyAdmin: Scalars['Boolean']['output'];
  isStudyAdminEditable: Scalars['Boolean']['output'];
  isTrained: Scalars['Boolean']['output'];
  isTrainedEditable: Scalars['Boolean']['output'];
  user: UserModel;
};

export type Tag = {
  __typename?: 'Tag';
  _id: Scalars['String']['output'];
  complete: Scalars['Boolean']['output'];
  /** The data stored in the tag, not populated until a colaborator has tagged */
  data?: Maybe<Scalars['JSON']['output']>;
  /** If the tag is enabled as part of the study, way to disable certain tags */
  enabled: Scalars['Boolean']['output'];
  entry: Entry;
  /** Way to rank tags based on order to be tagged */
  order: Scalars['Float']['output'];
  study: Study;
  /** The user assigned to the tag  */
  user?: Maybe<Scalars['String']['output']>;
};

export type TagSchema = {
  __typename?: 'TagSchema';
  dataSchema: Scalars['JSON']['output'];
  uiSchema: Scalars['JSON']['output'];
};

export type TagSchemaInput = {
  dataSchema: Scalars['JSON']['input'];
  uiSchema: Scalars['JSON']['input'];
};

export type UploadResult = {
  __typename?: 'UploadResult';
  message?: Maybe<Scalars['String']['output']>;
  status: UploadStatus;
};

export type UploadSession = {
  __typename?: 'UploadSession';
  /** The ID of the upload session */
  _id: Scalars['ID']['output'];
  created: Scalars['DateTime']['output'];
  dataset: Scalars['String']['output'];
};

export enum UploadStatus {
  Error = 'ERROR',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

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
