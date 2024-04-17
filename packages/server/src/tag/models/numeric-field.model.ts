import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class NumericField {
  @Field()
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
