import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Entry } from 'src/entry/models/entry.model';
import { EntryService } from 'src/entry/services/entry.service';
import { VideoField } from '../models/video-field.model';

@Resolver(() => VideoField)
export class VideoFieldResolver {
  constructor(private readonly entryService: EntryService) {}

  @ResolveField(() => [Entry])
  async entries(@Parent() videoField: VideoField): Promise<Entry[]> {
    return Promise.all(
      videoField.entries.map(async (id) => {
        const entry = await this.entryService.find(id);
        if (!entry) {
          throw new Error(`Invalid entry id: ${id}`);
        }
        return entry;
      })
    );
  }
}
