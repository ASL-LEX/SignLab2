import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


/**
 * Represents a single user uploading against a dataset.
 */
@Schema()
export class UploadSession {
  // TODO: Add in user
  // @Prop({ required: true })
  // user: string;

  @Prop({ required: true })
  dataset: string;

  @Prop({ required: true })
  created: Date;
}

export type UploadSessionDocument = UploadSession & Document;
export const UploadSessionSchema = SchemaFactory.createForClass(UploadSession);
