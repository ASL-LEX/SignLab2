import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BucketInfo, BucketType } from './bucket-info.model';
import { GcpBucketMaker } from './gcp-bucket';
import { Bucket } from './bucket';

@Injectable()
export class BucketFactory {
  constructor(@InjectModel(BucketInfo.name) private readonly bucketInfoModel: Model<BucketInfo>, private readonly gcpBucketMaker: GcpBucketMaker) {}

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

    switch(bucketInfo.bucketType) {
      case BucketType.GCP:
        return this.gcpBucketMaker.getGcpBucket(bucketInfo);
      default:
        throw new Error(`Unsupported bucket type ${bucketInfo.bucketType}`);
    }
  }
}
