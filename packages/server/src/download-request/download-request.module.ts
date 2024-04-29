import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GcpModule } from 'src/gcp/gcp.module';
import { BucketModule } from '../bucket/bucket.module';
import { DatasetModule } from '../dataset/dataset.module';
import { EntryModule } from '../entry/entry.module';
import { OrganizationModule } from '../organization/organization.module';
import { DatasetDownloadRequest, DatasetDownloadRequestSchema } from './models/dataset-download-request.model';
import { StudyDownloadRequest, StudyDownloadRequestSchema } from './models/study-download-request.model';
import { CreateDatasetDownloadPipe } from './pipes/dataset-download-request-create.pipe';
import { DatasetDownloadRequestResolver } from './resolvers/dataset-download-request.resolver';
import { DatasetDownloadService } from './services/dataset-download-request.service';
import { DownloadRequestService } from './services/download-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyDownloadRequest.name, schema: StudyDownloadRequestSchema },
      { name: DatasetDownloadRequest.name, schema: DatasetDownloadRequestSchema }
    ]),
    OrganizationModule,
    DatasetModule,
    EntryModule,
    BucketModule,
    GcpModule
  ],
  providers: [DatasetDownloadRequestResolver, DatasetDownloadService, DownloadRequestService, CreateDatasetDownloadPipe]
})
export class DownloadRequestModule {}
