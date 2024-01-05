import { Provider } from '@nestjs/common';
import { Sdk, getSdk } from '../graphql/sdk';
import { GraphQLClient } from 'graphql-request';
import { ConfigService } from '@nestjs/config';

export const AUTH_SDK_PROVIDER = 'AUTH_SDK_PROVIDER';

export const authSDKProvider: Provider<Sdk> = {
  provide: AUTH_SDK_PROVIDER,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    // TODO: In the future, authentication will need to be handled on
    // the endpoint
    const endpoint = configService.getOrThrow<string>('auth.graphqlEndpoint');
    const client = new GraphQLClient(endpoint);

    return getSdk(client);
  }
};
