import { Module } from '@nestjs/common';
import { storageProvider } from './providers/storage.provider';

@Module({
  providers: [storageProvider],
  exports: [storageProvider]
})
export class GcpModule {}
