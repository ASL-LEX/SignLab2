import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FreeTextField {
  @Field()
  value: string;
}
