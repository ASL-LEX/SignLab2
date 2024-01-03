import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

export const GCP_STORAGE_PROVIDER = 'GCP_STORAGE_PROVIDER';

export const storageProvider: Provider<Storage> = {
  provide: GCP_STORAGE_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const keyFileName: string | undefined = configService.get<string>('gcp.storage.keyFilename');

    // If no key file is provided, use the default credentials
    if (!keyFileName) {
      return new Storage();
    }

    // Otherwise, use the provided credentials
    return new Storage({
      keyFilename: configService.getOrThrow<string>('gcp.storage.keyFilename')
    });
  },
  inject: [ConfigService]
};
