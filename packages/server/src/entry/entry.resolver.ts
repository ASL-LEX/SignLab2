import { Args, ID, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Dataset } from '../dataset/dataset.model';
import { Entry } from './entry.model';
import { EntryCreate } from './dtos/create.dto';
import { EntryService } from './entry.service';
import { DatasetPipe } from '../dataset/pipes/dataset.pipe';

@Resolver(() => Entry)
export class EntryResolver {
  constructor(private readonly entryService: EntryService) {}

  // TODO: Validate the entryID is unique
  @Mutation(() => Entry)
  async createEntry(@Args('entry') entry: EntryCreate, @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset): Promise<Entry> {
    return this.entryService.create(entry, dataset);
  }

  @Query(() => [Entry])
  async entryForDataset(@Args('dataset', { type: () => ID }) dataset: Dataset): Promise<Entry[]> {
    return this.entryService.findForDataset(dataset);
  }
}