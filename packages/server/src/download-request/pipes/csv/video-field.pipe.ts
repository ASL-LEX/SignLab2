import { PipeTransform, Injectable } from '@nestjs/common';
import { EntryService } from '../../../entry/services/entry.service';

/**
 * Handles converting an Entry ID into the filename. If the value is null/undefined, then
 * an empty string is returned.
 */
@Injectable()
export class VideoCsvTransformer implements PipeTransform<any, Promise<string>> {
  constructor(private readonly entryService: EntryService) {}

  async transform(value: any): Promise<string> {
    if (!value) {
      return '';
    }

    // Otherwise try to get an entry
    const entry = await this.entryService.find(value);
    if (!entry) {
      throw new Error(`Invalid entry id: ${value}`);
    }

    // Now grab just the file name from the entry's bucket location
    return entry.bucketLocation.split('/').pop() || '';
  }
}
