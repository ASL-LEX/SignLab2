import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Entry } from '../models/entry.model';
import { Model } from 'mongoose';
import { EntryCreate } from '../dtos/create.dto';
import { Dataset } from '../../dataset/dataset.model';
import { GCP_STORAGE_PROVIDER } from '../../gcp/providers/storage.provider';
import { Bucket, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../../jwt/token.dto';

@Injectable()
export class EntryService {
  private readonly bucketName = this.configService.getOrThrow<string>('gcp.storage.bucket');
  private readonly bucket: Bucket = this.storage.bucket(this.bucketName);
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');

  constructor(
    @InjectModel(Entry.name) private readonly entryModel: Model<Entry>,
    @Inject(GCP_STORAGE_PROVIDER) private readonly storage: Storage,
    private readonly configService: ConfigService
  ) {}

  async find(entryID: string): Promise<Entry | null> {
    return this.entryModel.findOne({ _id: entryID });
  }

  async create(entryCreate: EntryCreate, dataset: Dataset, user: TokenPayload): Promise<Entry> {
    return this.entryModel.create({
      ...entryCreate,
      dataset: dataset._id,
      organization: dataset.organization,
      recordedInSignLab: false,
      dateCreated: new Date(),
      creator: user.id
    });
  }

  async delete(entry: Entry): Promise<void> {
    await this.entryModel.deleteOne({ _id: entry._id });
  }

  async findForDataset(dataset: Dataset): Promise<Entry[]> {
    return this.entryModel.find({ dataset: dataset._id.toString() });
  }

  async exists(entryID: string, dataset: Dataset): Promise<boolean> {
    const entry = await this.entryModel.findOne({ entryID, dataset: dataset._id });
    return !!entry;
  }

  async setBucketLocation(entry: Entry, bucketLocation: string): Promise<void> {
    await this.entryModel.updateOne({ _id: entry._id }, { bucketLocation });
  }

  async getSignedUrl(entry: Entry): Promise<string> {
    const file = this.bucket.file(entry.bucketLocation);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + this.expiration
    });
    return url;
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
