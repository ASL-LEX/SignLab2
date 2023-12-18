import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { EntryService } from '../services/entry.service';
import { Entry } from '../models/entry.model';

@Injectable()
export class EntryPipe implements PipeTransform<string, Promise<Entry>> {
  constructor(private readonly entryService: EntryService) {}

  async transform(value: string): Promise<Entry> {
    const entry = await this.entryService.find(value);
    if (!entry) {
      throw new BadRequestException(`Entry with ID ${value} not found`);
    }
    return entry;
  }
}

@Injectable()
export class EntriesPipe implements PipeTransform<string[], Promise<Entry[]>> {
  constructor(private readonly entryPipe: EntryPipe) {}

  async transform(value: string[]): Promise<Entry[]> {
    return Promise.all(value.map((id) => this.entryPipe.transform(id)));
  }
}
