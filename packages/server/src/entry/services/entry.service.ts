import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Entry } from '../models/entry.model';
import { Model } from 'mongoose';
import { EntryCreate } from '../dtos/create.dto';
import { Dataset } from '../../dataset/dataset.model';

@Injectable()
export class EntryService {
  constructor(@InjectModel(Entry.name) private readonly entryMode: Model<Entry>) {}

  async find(entryID: string): Promise<Entry | null> {
    return this.entryMode.findOne({ _id: entryID });
  }

  async create(entryCreate: EntryCreate, dataset: Dataset): Promise<Entry> {
    return this.entryMode.create({
      ...entryCreate,
      dataset: dataset._id,
      organization: dataset.organization,
      recordedInSignLab: false
    });
  }

  async findForDataset(dataset: Dataset): Promise<Entry[]> {
    return this.entryMode.find({ dataset: dataset._id });
  }
}
