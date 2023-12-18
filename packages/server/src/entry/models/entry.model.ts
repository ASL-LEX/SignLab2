import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';
import JSON from 'graphql-type-json';

@Schema()
@ObjectType()
export class Entry {
  @Field()
  _id: string;

  // TODO: Add GraphQL reference back to organization
  @Prop()
  @Field(() => ID)
  organization: string;

  @Prop({ required: true, trim: true })
  @Field()
  entryID: string;

  @Prop({ trim: true })
  bucketLocation: string;

  @Prop({ required: true, trim: true })
  @Field()
  contentType: string;

  @Prop({ required: true })
  recordedInSignLab: boolean;

  // TODO: Add info on in-SignLab recording

  // TODO: Add GraphQL reference back to dataset object
  @Prop()
  @Field(() => ID)
  dataset: string;

  // TODO: Add GraphQL reference back to user object
  @Prop()
  @Field(() => ID)
  creator: string;

  @Prop()
  @Field()
  dateCreated: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  @Field(() => JSON)
  meta: any;

  // TODO: Add creator field
}

export type EntryDocument = Entry & Document;
export const EntrySchema = SchemaFactory.createForClass(Entry);
