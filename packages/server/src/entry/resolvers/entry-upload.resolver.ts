import { Mutation, Resolver } from '@nestjs/graphql';
import { EntryUploadService } from '../services/entry-upload.service';

@Resolver()
export class EntryUploadResolver {
  constructor(private readonly entryUploadService: EntryUploadService) {}

  // TODO: Create a result type to carry any potential errors
  @Mutation(() => Boolean)
  async uploadEntryCSV(): Promise<boolean> {
    return false;
  }

  @Mutation(() => Boolean)
  async processEntryUploads(): Promise<boolean> {
    return false;
  }
}
