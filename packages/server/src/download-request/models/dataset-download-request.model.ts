import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DownloadStatus, DownloadRequest } from './download-request.model';
import { ObjectType, Field } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class DatasetDownloadRequest implements DownloadRequest {
  @Prop({ required: true })
  organization: string;

  @Prop({ required: true })
  @Field()
  date: Date;

  @Prop({ required: true, enum: DownloadStatus })
  @Field(() => DownloadStatus)
  status: DownloadStatus;

  @Prop({ required: true })
  dataset: string;

  @Prop({ required: true })
  entryZIPLocation: string;
}

export type DatasetDownloadRequestDocument = Document & DatasetDownloadRequest;
export const DatasetDownloadRequestSchema = SchemaFactory.createForClass(DatasetDownloadRequest);
