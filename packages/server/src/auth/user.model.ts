import { ObjectType, Field, Directive, ID } from '@nestjs/graphql';

/** Definition for external user */
@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@extends')
export class UserModel {
  @Field(() => ID)
  @Directive('@external')
  id: string;
}
