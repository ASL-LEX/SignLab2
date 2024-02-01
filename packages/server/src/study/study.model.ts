import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import mongoose, { Document } from 'mongoose';
import JSON from 'graphql-type-json';
import { Layout, JsonSchema as JSONSchema } from '@jsonforms/core';

/** Definition for the tag in JSON schema */
@Schema()
@ObjectType()
export class TagSchema {
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  @Field(() => JSON)
  dataSchema: JSONSchema;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  @Field(() => JSON)
  uiSchema: Layout;
}

const TagSchemaSchema = SchemaFactory.createForClass(TagSchema);

@Schema()
@ObjectType()
export class Study {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field()
  name: string;

  @Prop()
  organization: string;

  @Prop()
  @Field()
  description: string;

  @Prop()
  @Field()
  instructions: string;

  @Prop({ type: TagSchemaSchema, required: true })
  @Field(() => TagSchema)
  tagSchema: TagSchema;

  // TODO: Add resolver for project field
  @Prop()
  @Field(() => ID)
  project: string;

  @Prop()
  @Field()
  tagsPerEntry: number;
}

export type StudyDocument = Study & Document;
export const StudySchema = SchemaFactory.createForClass(Study);
