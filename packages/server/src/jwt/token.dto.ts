// TODO: In the future this type will be retrived from the auth microservice
export interface TokenPayload {
  id: string;
  projectId: string;
  role: number;
  iat: number;
  exp: number;
  iss: string;
}
