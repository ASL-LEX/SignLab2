import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';


/**
 * Represents a single user uploading against a dataset.
 */
@Schema()
@ObjectType()
export class UploadSession {
  // TODO: Add in user
  // @Prop({ required: true })
  // user: string;

  @Prop({ required: true })
  @Field()
  dataset: string;

  @Prop({ required: true })
  @Field()
  created: Date;
}

export type UploadSessionDocument = UploadSession & Document;
export const UploadSessionSchema = SchemaFactory.createForClass(UploadSession);
