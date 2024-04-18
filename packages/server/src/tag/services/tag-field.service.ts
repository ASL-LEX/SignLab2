import { Injectable } from '@nestjs/common';
import { TagField, TagFieldUnion, TagFieldType } from '../models/tag-field.model';
import { BooleanField } from '../models/boolean-field.model';
import { FreeTextField } from '../models/free-text-field.model';
import { NumericField } from '../models/numeric-field.model';
import { SliderField } from '../models/slider-field.model';
import { EntryService } from '../../entry/services/entry.service';
import { VideoField } from '../models/video-field.model';
import { Entry } from 'src/entry/models/entry.model';
import { AslLexField, LexiconEntry } from '../models/asl-lex-field.model';
import { ConfigService } from '@nestjs/config';


/**
 * Handles turning the rawdata fields into TagFields
 */
@Injectable()
export class TagFieldService {
  private readonly aslLexID = this.configService.getOrThrow<string>('lexicon.aslLexID');

  constructor(private readonly entryService: EntryService, private readonly configService: ConfigService) {}

  async produceField(tagField: TagField): Promise<typeof TagFieldUnion | null> {
    if (!tagField.data) {
      return null;
    }
    switch(tagField.type) {
      case TagFieldType.ASL_LEX:
        return this.getAslLexField(tagField);
      case TagFieldType.BOOLEAN:
        return new BooleanField(tagField.data);
      case TagFieldType.FREE_TEXT:
        return new FreeTextField(tagField.data);
      case TagFieldType.NUMERIC:
        return new NumericField(tagField.data);
      case TagFieldType.SLIDER:
        return new SliderField(tagField.data);
      case TagFieldType.VIDEO_RECORD:
        return this.getVideoField(tagField);
      default:
        throw new Error(`Unsupported tag field type: ${tagField.type}`);
    }
  }

  private async getVideoField(tagField: TagField): Promise<VideoField> {
    const data: string[] = JSON.parse(tagField.data);
    const entryIDs = data.filter((data) => data != null)
    const entries: (Entry | null)[] = [];

    for (const entryID of entryIDs) {
      entries.push(await this.entryService.find(entryID));
    }

    const filtered: Entry[] = entries.filter(entry => entry != null) as Entry[];

    return new VideoField(filtered);
  }

  private async getAslLexField(tagField: TagField): Promise<AslLexField> {
    const key = tagField.data as string;
    const lexicon = this.aslLexID;
    return new AslLexField(new LexiconEntry(key, lexicon));
  }
}