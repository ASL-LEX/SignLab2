import { Args, ID, Mutation, Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Dataset } from '../../dataset/dataset.model';
import { Entry } from '../models/entry.model';
import { EntryCreate } from '../dtos/create.dto';
import { EntryService } from '../services/entry.service';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => Entry)
export class EntryResolver {
  constructor(private readonly entryService: EntryService) {}

  // TODO: Validate the entryID is unique
  @Mutation(() => Entry)
  async createEntry(@Args('entry') entry: EntryCreate, @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset): Promise<Entry> {
    return this.entryService.create(entry, dataset);
  }

  @Query(() => [Entry])
  async entryForDataset(@Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset): Promise<Entry[]> {
    return this.entryService.findForDataset(dataset);
  }

  @ResolveField(() => String)
  async signedUrl(@Parent() entry: Entry): Promise<string> {
    return this.entryService.getSignedUrl(entry);
  }

  // NOTE: With the current implementation, this is only really helpful
  //       if the request to `signedUrl` is made.
  @ResolveField(() => Number, { description: 'Get the number of milliseconds the signed URL is valid for.' })
  async signedUrlExpiration(@Parent() entry: Entry): Promise<number> {
    return this.entryService.getSignedUrlExpiration(entry);
  }
}
