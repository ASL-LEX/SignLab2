import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BucketInfo, BucketType } from './bucket-info.model';
import { GcpBucketMaker } from './gcp-bucket';
import { Bucket } from './bucket';
import { SECRET_MANAGER_PROVIDER } from 'src/gcp/providers/secret.provider';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

@Injectable()
export class BucketFactory {
  constructor(
    @InjectModel(BucketInfo.name) private readonly bucketInfoModel: Model<BucketInfo>,
    private readonly gcpBucketMaker: GcpBucketMaker,
    @Inject(SECRET_MANAGER_PROVIDER) private readonly secretClient: SecretManagerServiceClient
  ) {}

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

    // Get the secret associated with the bucket
    const [version] = await this.secretClient.accessSecretVersion({ name: bucketInfo.secretName });
    if (!version) {
      throw new Error('Could not get credentials for bucket');
    }

    // Get the payload of the secret
    const credentials = version.payload?.data?.toString();
    if (!credentials) {
      throw new Error('Unable to parse credentials');
    }

    switch (bucketInfo.bucketType) {
      case BucketType.GCP:
        return this.gcpBucketMaker.getGcpBucket(bucketInfo, credentials);
      default:
        throw new Error(`Unsupported bucket type ${bucketInfo.bucketType}`);
    }
  }
}
