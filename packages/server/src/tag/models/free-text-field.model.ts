import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FreeTextField {
  @Field()
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
