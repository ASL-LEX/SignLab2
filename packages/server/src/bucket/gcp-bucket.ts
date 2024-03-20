import { Bucket, BucketObjectAction } from './bucket';
import { BucketInfo } from './bucket-info.model';
import { Injectable } from '@nestjs/common';
import { Storage, Bucket as StorageBucket } from '@google-cloud/storage';

/** Wrapper maker for the bucket so that dependencies can be injected */
@Injectable()
export class GcpBucketMaker {
  async getGcpBucket(bucketInfo: BucketInfo, credentials: string): Promise<GcpBucket> {
    // Expects the key to be a GCP service account key
    let key: any = null;
    try {
      key = JSON.parse(credentials);
    } catch(e) {
      throw new Error('Failed to parse credentails');
    }

    // Make the GCP storage client
    const storage = new Storage({ credentials: key });

    // Get the bucket
    const bucket = storage.bucket(bucketInfo.bucketName);

    // Return the wrapper around the GCP bucket implementation
    return new GcpBucket(bucket);
  }
}

class GcpBucket implements Bucket {
  constructor(private readonly storageBucket: StorageBucket) {}

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
