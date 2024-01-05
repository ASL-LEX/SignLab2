import { ObjectType, Field } from '@nestjs/graphql';
import { UserModel } from '../../auth/user.model';


@ObjectType()
export class StudyPermissionModel {
  @Field(() => UserModel)
  user: string;

  @Field()
  isStudyAdmin: boolean;

  @Field()
  isStudyAdminEditable: boolean;

  @Field()
  isContributor: boolean;

  @Field()
  isContributorEditable: boolean;

  @Field()
  isTrained: boolean;

  @Field()
  isTrainedEditable: boolean;
}
