import { InputType, OmitType } from '@nestjs/graphql';
import { Entry } from '../models/entry.model';

const excludedFields: (keyof Entry)[] = ['_id', 'organization', 'dataset', 'recordedInSignLab', 'dateCreated'];

@InputType()
export class EntryCreate extends OmitType(Entry, excludedFields, InputType) {}
