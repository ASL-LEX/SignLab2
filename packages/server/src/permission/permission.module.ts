import { Module, forwardRef } from '@nestjs/common';
import { casbinProvider } from './casbin.provider';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from './permission.service';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => ProjectModule), AuthModule],
  providers: [casbinProvider, PermissionResolver, PermissionService],
  exports: [casbinProvider]
})
export class PermissionModule {}
