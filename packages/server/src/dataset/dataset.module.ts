import { Module } from '@nestjs/common';
import { DatasetResolver } from './dataset.resolver';
import { DatasetService } from './dataset.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dataset, DatasetSchema } from './dataset.model';
import { DatasetPipe } from './pipes/dataset.pipe';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dataset.name, schema: DatasetSchema }]), AuthModule],
  providers: [DatasetResolver, DatasetService, DatasetPipe],
  exports: [DatasetService, DatasetPipe]
})
export class DatasetModule {}
