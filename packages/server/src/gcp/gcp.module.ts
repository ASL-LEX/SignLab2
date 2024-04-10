import { Module } from '@nestjs/common';
import { storageProvider } from './providers/storage.provider';
import { firebaseProvider } from './providers/firebase.provider';
import { secretManagerProvider } from './providers/secret.provider';

@Module({
  providers: [storageProvider, firebaseProvider, secretManagerProvider],
  exports: [storageProvider, firebaseProvider, secretManagerProvider]
})
export class GcpModule {}
