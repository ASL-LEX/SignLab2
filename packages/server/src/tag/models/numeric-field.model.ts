import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class NumericField {
  @Field()
  value: number;
}
