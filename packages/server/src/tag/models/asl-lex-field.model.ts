import { Field, ObjectType, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "key, lexicon")')
@Directive('@extends')
export class LexiconEntry {
  @Field()
  @Directive('@external')
  key: string;

  @Field()
  @Directive('@external')
  lexicon: string;

  constructor(key: string, lexicon: string) {
    this.key = key;
    this.lexicon = lexicon;
  }
}

@ObjectType()
export class AslLexField {
  @Field(() => LexiconEntry)
  lexiconEntry: LexiconEntry;

  constructor(lexiconEntry: LexiconEntry) {
    this.lexiconEntry = lexiconEntry;
  }
}
