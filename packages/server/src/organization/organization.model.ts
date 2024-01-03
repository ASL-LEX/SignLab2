import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Organization {
  @Field(() => ID)
  _id: string;

  @Prop()
  @Field()
  name: string;

  /** Maps the `projectId` in the auth service back to the organization */
  @Prop()
  projectId: string;
}

export type OrganizationDocument = Organization & Document;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
