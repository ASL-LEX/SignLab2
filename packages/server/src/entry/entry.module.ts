import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entry, EntrySchema } from './models/entry.model';
import { EntryResolver } from './resolvers/entry.resolver';
import { EntryService } from './services/entry.service';
import { DatasetModule } from '../dataset/dataset.module';
import { EntryPipe, EntriesPipe } from './pipes/entry.pipe';
import { UploadSession, UploadSessionSchema } from './models/upload-session.model';
import { EntryUpload, EntryUploadSchema } from './models/entry-upload.model';
import { UploadSessionResolver } from './resolvers/upload-session.resolver';
import { UploadSessionService } from './services/upload-session.service';
import { EntryUploadResolver } from './resolvers/entry-upload.resolver';
import { EntryUploadService } from './resolvers/entry-upload.service';
import { UploadSessionPipe } from './pipes/upload-session.pipe';
import { GcpModule } from '../gcp/gcp.module';
import { CsvValidationService } from './services/csv-validation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entry.name, schema: EntrySchema },
      { name: UploadSession.name, schema: UploadSessionSchema },
      { name: EntryUpload.name, schema: EntryUploadSchema },
    ]),
    DatasetModule,
    GcpModule
  ],
  providers: [
    EntryResolver,
    EntryService,
    EntryPipe,
    EntriesPipe,
    UploadSessionService,
    UploadSessionResolver,
    UploadSessionPipe,
    EntryUploadResolver,
    EntryUploadService,
    CsvValidationService
  ],
  exports: [EntryPipe, EntriesPipe, EntryService]
})
export class EntryModule {}
