import { Provider } from '@nestjs/common';
import { Sdk } from '../graphql/sdk';

export const AUTH_SDK_PROVIDER = 'AUTH_SDK_PROVIDER';

export const authSDKProvider: Provider<Sdk> = {
  provide: AUTH_SDK_PROVIDER,
  useFactory: async () => {


  }
};
