import { ObjectType, Field } from '@nestjs/graphql';
import { Entry } from 'src/entry/models/entry.model';

@ObjectType()
export class VideoField {
  @Field(() => [Entry])
  entries: Entry[];

  constructor(entries: Entry[]) {
    this.entries = entries;
  }
}
