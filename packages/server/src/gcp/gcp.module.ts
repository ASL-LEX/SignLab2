import { Module } from '@nestjs/common';
import { storageProvider } from './providers/storage.provider';
import { firebaseProvider } from './providers/firebase.provider';

@Module({
  providers: [storageProvider, firebaseProvider],
  exports: [storageProvider, firebaseProvider]
})
export class GcpModule {}
