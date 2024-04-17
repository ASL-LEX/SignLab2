import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BooleanField {
  @Field()
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
}
