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
import { CreateStudyDownloadPipe } from './pipes/study-download-request-create.pipe';
import { StudyModule } from 'src/study/study.module';
import { StudyDownloadRequestResolver } from './resolvers/study-download-request.resolver';
import { StudyDownloadService } from './services/study-download-request.service';
import { TagModule } from '../tag/tag.module';
import { StudyDownloadRequestPipe } from './pipes/study-download-request.pipe';
import { DatasetDownloadRequestPipe } from './pipes/dataset-download-request.pipe';
import { BasicCsvTransformer } from './pipes/csv/basic-field.pipe';
import { VideoCsvTransformer } from './pipes/csv/video-field.pipe';
import { EntryMetadataDownloadService } from './services/entry-metadata-download.service';

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
    GcpModule,
    StudyModule,
    TagModule
  ],
  providers: [
    DatasetDownloadRequestResolver,
    DatasetDownloadService,
    DownloadRequestService,
    CreateDatasetDownloadPipe,
    CreateStudyDownloadPipe,
    StudyDownloadRequestResolver,
    StudyDownloadService,
    StudyDownloadRequestPipe,
    DatasetDownloadRequestPipe,
    BasicCsvTransformer,
    VideoCsvTransformer,
    EntryMetadataDownloadService
  ]
})
export class DownloadRequestModule {}
