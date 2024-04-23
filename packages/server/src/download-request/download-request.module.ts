import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatasetDownloadRequest, DatasetDownloadRequestSchema } from './models/dataset-download-request.model';
import { StudyDownloadRequest, StudyDownloadRequestSchema } from './models/study-download-request.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyDownloadRequest.name, schema: StudyDownloadRequestSchema },
      { name: DatasetDownloadRequest.name, schema: DatasetDownloadRequestSchema }
    ])
  ]
})
export class DownloadRequestModule {}
