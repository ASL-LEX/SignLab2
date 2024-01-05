import { Module, forwardRef } from '@nestjs/common';
import { casbinProvider } from './casbin.provider';
import { PermissionService } from './permission.service';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';
import { StudyModule } from '../study/study.module';
import { ProjectPermissionResolver } from './resolvers/project.resolver';
import { OwnerPermissionResolver } from './resolvers/owner.resolver';

@Module({
  imports: [forwardRef(() => ProjectModule), AuthModule, forwardRef(() => StudyModule)],
  providers: [casbinProvider, PermissionService, ProjectPermissionResolver, OwnerPermissionResolver],
  exports: [casbinProvider]
})
export class PermissionModule {}
