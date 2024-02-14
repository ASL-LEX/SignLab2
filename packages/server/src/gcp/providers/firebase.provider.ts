import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FIREBASE_PROVIDER = 'FIREBASE_ADMIN';

export const firebaseProvider: Provider<admin.app.App> = {
  provide: FIREBASE_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const keyFileName: string | undefined = configService.get<string>('gcp.storage.keyFilename');

    // If no key file is provided, use the default credentials
    if (!keyFileName) {
      return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }

    // Otherwise, use the provided key file
    return admin.initializeApp({
      credential: admin.credential.cert(keyFileName),
    });
  },
  inject: [ConfigService]
};

