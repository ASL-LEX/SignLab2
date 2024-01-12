import { Module, forwardRef } from '@nestjs/common';
import { DatasetResolver } from './dataset.resolver';
import { DatasetService } from './dataset.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dataset, DatasetSchema } from './dataset.model';
import { DatasetPipe } from './pipes/dataset.pipe';
import { PermissionModule } from '../permission/permission.module';
import { JwtModule } from '../jwt/jwt.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dataset.name, schema: DatasetSchema }]), forwardRef(() => PermissionModule), JwtModule, ProjectModule],
  providers: [DatasetResolver, DatasetService, DatasetPipe],
  exports: [DatasetService, DatasetPipe]
})
export class DatasetModule {}
