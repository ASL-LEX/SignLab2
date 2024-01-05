import { ObjectType, Field } from '@nestjs/graphql';
import { UserModel } from '../../auth/user.model';


@ObjectType()
export class ProjectPermissionModel {
  @Field(() => UserModel)
  user: string;

  @Field()
  isProjectAdmin: boolean;

  @Field()
  editable: boolean;
}
