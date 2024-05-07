import { Module } from '@nestjs/common';
import { storageProvider } from './providers/storage.provider';
import { firebaseProvider } from './providers/firebase.provider';
import { secretManagerProvider } from './providers/secret.provider';
import { jobClientProvider } from './providers/job.provider';

@Module({
  providers: [storageProvider, firebaseProvider, secretManagerProvider, jobClientProvider],
  exports: [storageProvider, firebaseProvider, secretManagerProvider, jobClientProvider]
})
export class GcpModule {}
