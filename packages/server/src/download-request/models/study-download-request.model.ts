import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DownloadRequest, DownloadStatus } from './download-request.model';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class StudyDownloadRequest implements DownloadRequest {
  @Field()
  _id: string;

  @Prop({ required: true })
  organization: string;

  @Prop({ required: true })
  @Field()
  date: Date;

  @Prop({ required: true, enum: DownloadStatus })
  @Field()
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
