import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BucketInfo } from './bucket-info.model';

@Injectable()
export class BucketFactory {
  constructor(@InjectModel(BucketInfo.name) private readonly bucketInfoModel: Model<BucketInfo>) {}

  /**
   * Factory method which gets the correct storage bucket inforamtion for the
   * given organization.
   */
  async getBucket(organization: string): Promise<Bucket | null> {
    // Get the information on the bucket for the given organization
    const bucketInfo = await this.bucketInfoModel.findOne({ organization });
    if (!bucketInfo) {
      return bucketInfo;
    }
  }
}
