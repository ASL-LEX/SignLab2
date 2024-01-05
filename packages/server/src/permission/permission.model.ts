import { ObjectType, registerEnumType, Field, Directive, ID } from '@nestjs/graphql';
import { Roles } from './permissions/roles';

registerEnumType(Roles, {
  name: 'Roles'
});

/** Definition for external user */
@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@extends')
export class UserModel {
  @Field(() => ID)
  @Directive('@external')
  id: string;
}

@ObjectType()
export class Permission {
  @Field(() => UserModel)
  user: string;

  @Field(() => Roles)
  role: Roles;

  @Field()
  hasRole: boolean;

  @Field()
  editable: boolean;
}
