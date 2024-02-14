import { Module, forwardRef } from '@nestjs/common';
import { casbinProvider } from './casbin.provider';
import { PermissionService } from './permission.service';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';
import { StudyModule } from '../study/study.module';
import { ProjectPermissionResolver } from './resolvers/project.resolver';
import { OwnerPermissionResolver } from './resolvers/owner.resolver';
import { StudyPermissionResolver } from './resolvers/study.resolver';
import { DatasetPermissionResolver } from './resolvers/dataset.resolver';
import { DatasetModule } from '../dataset/dataset.module';
import { PermissionResolver } from './resolvers/permission.resolver';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    forwardRef(() => ProjectModule),
    AuthModule,
    forwardRef(() => StudyModule),
    forwardRef(() => DatasetModule),
    OrganizationModule
  ],
  providers: [
    casbinProvider,
    PermissionService,
    ProjectPermissionResolver,
    OwnerPermissionResolver,
    StudyPermissionResolver,
    DatasetPermissionResolver,
    PermissionResolver
  ],
  exports: [casbinProvider]
})
export class PermissionModule {}
