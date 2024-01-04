import { Module } from '@nestjs/common';
import { casbinProvider } from './casbin.provider';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from './permission.service';

@Module({
  providers: [casbinProvider, PermissionResolver, PermissionService],
  exports: [casbinProvider]
})
export class PermissionModule {}
