import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DownloadRequest, DownloadStatus } from './download-request.model';

@Schema()
export class StudyDownloadRequest implements DownloadRequest {
  @Prop({ required: true })
  organization: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: DownloadStatus })
  status: DownloadStatus;

  @Prop({ required: true })
  study: string;

  @Prop({ requied: false })
  tagCSVLocation?: string;

  @Prop({ required: true })
  entryZIPLocation?: string;

  @Prop({ required: false })
  bucketLocation?: string;

  @Prop({ required: false })
  entryJSONLocation?: string;

  @Prop({ required: false })
  webhookPayloadLocation?: string;
}

export type StudyDownloadRequestDocument = Document & StudyDownloadRequest;
export const StudyDownloadRequestSchema = SchemaFactory.createForClass(StudyDownloadRequest);
