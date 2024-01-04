import { Module } from '@nestjs/common';
import { DatasetResolver } from './dataset.resolver';
import { DatasetService } from './dataset.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dataset, DatasetSchema } from './dataset.model';
import { DatasetPipe } from './pipes/dataset.pipe';
import { PermissionModule } from '../permission/permission.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dataset.name, schema: DatasetSchema }]), PermissionModule, JwtModule],
  providers: [DatasetResolver, DatasetService, DatasetPipe],
  exports: [DatasetService, DatasetPipe]
})
export class DatasetModule {}
