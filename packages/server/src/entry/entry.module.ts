import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entry, EntrySchema } from './models/entry.model';
import { EntryResolver } from './entry.resolver';
import { EntryService } from './services/entry.service';
import { DatasetModule } from '../dataset/dataset.module';
import { EntryPipe, EntriesPipe } from './pipes/entry.pipe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
    DatasetModule
  ],
  providers: [EntryResolver, EntryService, EntryPipe, EntriesPipe],
  exports: [EntryPipe, EntriesPipe, EntryService]
})
export class EntryModule {}
