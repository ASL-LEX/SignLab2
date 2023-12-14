import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
