import { JobsClient } from '@google-cloud/run/build/src/v2';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const JOB_PROVIDER = 'GCP_JOB_CLIENT_PROVIDER';

export const jobClientProvider: Provider<JobsClient> = {
  provide: JOB_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const keyFilename: string | undefined = configService.get<string>('gcp.storage.keyFilename');

    // If no key file is provided, use the default credentials
    if (!keyFilename) {
      return new JobsClient();
    }

    return new JobsClient({ keyFilename });
  },
  inject: [ConfigService]
};
