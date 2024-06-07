import { Injectable } from '@nestjs/common';
import { Entry } from '../../entry/models/entry.model';

@Injectable()
export class EntryMetadataDownloadService {
  async generateEntryMetadata(entries: Entry[]): Promise<string> {
    let csv = 'filename,entryID';
    for (const entry of entries) {
      const filename = entry.bucketLocation.split('/').pop();
      csv += `\n${filename},${entry.entryID}`;
    }
    return csv;
  }
}
