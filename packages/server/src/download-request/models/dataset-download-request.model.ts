import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DownloadStatus, DownloadRequest } from './download-request.model';

@Schema()
export class DatasetDownloadRequest implements DownloadRequest {
  @Prop({ required: true })
  organization: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: DownloadStatus })
  status: DownloadStatus;

  @Prop({ required: true })
  dataset: string;

  @Prop({ required: true })
  entryZIPLocation: string;
}

export type DatasetDownloadRequestDocument = Document & DatasetDownloadRequest;
export const DatasetDownloadRequestSchema = SchemaFactory.createForClass(DatasetDownloadRequest);
