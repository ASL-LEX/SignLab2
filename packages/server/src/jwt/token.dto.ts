export interface TokenPayload {
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;
  firebase: {
    identities: {
      email: string[];
      email_verified: boolean;
    };
    sign_in_provider: string;
    user_id: string;
    tenant: string;
  };
  iat: number;
  iss: string;
  sub: string;
  user_id: string;
}
