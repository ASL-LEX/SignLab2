import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const SECRET_MANAGER_PROVIDER = 'GCP_SECRET_MANAGER_PROVIDER';

export const secretManagerProvider: Provider<SecretManagerServiceClient> = {
  provide: SECRET_MANAGER_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const keyFilename: string | undefined = configService.get<string>('gcp.storage.keyFilename');

    // If no key file is provided, use the default credentials
    if (!keyFilename) {
      return new SecretManagerServiceClient();
    }

    return new SecretManagerServiceClient({ keyFilename });
  },
  inject: [ConfigService]
};
