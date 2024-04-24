import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatasetDownloadRequest, DatasetDownloadRequestSchema } from './models/dataset-download-request.model';
import { StudyDownloadRequest, StudyDownloadRequestSchema } from './models/study-download-request.model';
import { DatasetDownloadRequestResolver } from './resolvers/dataset-download-request.resolver';
import { DatasetDownloadService } from './services/dataset-download-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyDownloadRequest.name, schema: StudyDownloadRequestSchema },
      { name: DatasetDownloadRequest.name, schema: DatasetDownloadRequestSchema }
    ])
  ],
  providers: [
    DatasetDownloadRequestResolver,
    DatasetDownloadService
  ]
})
export class DownloadRequestModule {}
