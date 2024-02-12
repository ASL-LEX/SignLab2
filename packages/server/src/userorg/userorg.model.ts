import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserOrg {
  @Prop()
  user: string;

  @Prop()
  org: string;
}

export type UserOrgDocument = UserOrg & Document;
export const UserOrgSchema = SchemaFactory.createForClass(UserOrg);
