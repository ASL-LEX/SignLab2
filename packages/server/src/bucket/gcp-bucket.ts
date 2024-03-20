import { Bucket, BucketObjectAction } from './bucket';
import { BucketInfo } from './bucket-info.model';
import { Injectable } from '@nestjs/common';

/** Wrapper maker for the bucket so that dependencies can be injected */
@Injectable()
export class GcpBucketMaker {
  async getGcpBucket(bucketInfo: BucketInfo): Promise<GcpBucket> {
    return new GcpBucket(bucketInfo);
  }
}

class GcpBucket implements Bucket {
  constructor(bucketInfo: BucketInfo) {}

  async getSignedUrl(location: string, action: BucketObjectAction, expiration: Date, contentType?: string | undefined): Promise<string> {
      return '';
  }

  async delete(location: string): Promise<void> {
      return;
  }

  async move(originalLocation: string, finalLocation: string): Promise<void> {
      return;
  }

  async exists(location: string): Promise<boolean> {
      return true;
  }
}
