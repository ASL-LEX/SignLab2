import { Field, InputType, OmitType, ID } from '@nestjs/graphql';
import { Study, TagSchema } from '../study.model';

@InputType()
class TagSchemaInput extends OmitType(TagSchema, [] as const, InputType) {}

@InputType()
export class StudyCreate extends OmitType(Study, ['_id', 'project', 'tagSchema'] as const, InputType) {
  @Field(() => ID)
  project: string;

  @Field()
  tagSchema: TagSchemaInput;
}
