import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SliderField {
  @Field()
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
