import { Module } from '@nestjs/common';
import { casbinProvider } from './casbin.provider';

@Module({
  providers: [
    casbinProvider
  ],
  exports: [casbinProvider]
})
export class PermissionModule {}
