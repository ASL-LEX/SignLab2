import { Provider } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export const OAUTH2_CLIENT_PROVIDER = 'OAUTH2_CLIENT_PROVIDER';

export const oauth2ClientProvider: Provider = {
  provide: OAUTH2_CLIENT_PROVIDER,
  useFactory: () => {
    return new OAuth2Client();
  }
};
