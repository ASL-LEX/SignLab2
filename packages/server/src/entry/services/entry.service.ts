import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Entry } from '../models/entry.model';
import { Model } from 'mongoose';
import { EntryCreate } from '../dtos/create.dto';
import { Dataset } from '../../dataset/dataset.model';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../../jwt/token.dto';
import { BucketFactory } from 'src/bucket/bucket-factory.service';
import { BucketObjectAction } from 'src/bucket/bucket';

@Injectable()
export class EntryService {
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');

  constructor(
    @InjectModel(Entry.name) private readonly entryModel: Model<Entry>,
    private readonly configService: ConfigService,
    private readonly bucketFactory: BucketFactory
  ) {}

  async find(entryID: string): Promise<Entry | null> {
    return this.entryModel.findOne({ _id: entryID });
  }

  async create(entryCreate: EntryCreate, dataset: Dataset, user: TokenPayload, isTraining: boolean): Promise<Entry> {
    // Make the entry, note that training entries are not associated with a dataset
    return this.entryModel.create({
      ...entryCreate,
      dataset: dataset._id,
      organization: dataset.organization,
      recordedInSignLab: false,
      dateCreated: new Date(),
      creator: user.user_id,
      isTraining
    });
  }

  async delete(entry: Entry): Promise<void> {
    await this.entryModel.deleteOne({ _id: entry._id });
  }

  async findForDataset(dataset: Dataset | string): Promise<Entry[]> {
    let id: string = '';

    if (typeof dataset === 'string') {
      id = dataset;
    } else {
      id = dataset._id.toString();
    }

    return this.entryModel.find({ dataset: id, isTraining: false });
  }

  async exists(entryID: string, dataset: Dataset): Promise<boolean> {
    const entry = await this.entryModel.findOne({ entryID, dataset: dataset._id });
    return !!entry;
  }

  async setBucketLocation(entry: Entry, bucketLocation: string): Promise<void> {
    await this.entryModel.updateOne({ _id: entry._id }, { bucketLocation });
  }

  async getSignedUrl(entry: Entry): Promise<string> {
    const bucket = await this.bucketFactory.getBucket(entry.organization);
    if (!bucket) {
      throw new Error('Missing bucket for entry');
    }
    return bucket.getSignedUrl(entry.bucketLocation, BucketObjectAction.READ, new Date(Date.now() + this.expiration));
  }

  /**
   * Get how long the signed URL is valid for in milliseconds.
   *
   * In the future, this could be configurable per entry.
   */
  async getSignedUrlExpiration(_entry: Entry): Promise<number> {
    return this.expiration;
  }
}
