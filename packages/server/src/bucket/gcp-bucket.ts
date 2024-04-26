import { Bucket, BucketObjectAction } from './bucket';
import { BucketInfo } from './bucket-info.model';
import { Injectable } from '@nestjs/common';
import { Storage, Bucket as StorageBucket } from '@google-cloud/storage';
import { PassThrough } from 'stream';

/** Wrapper maker for the bucket so that dependencies can be injected */
@Injectable()
export class GcpBucketMaker {
  async getGcpBucket(bucketInfo: BucketInfo, credentials: string): Promise<GcpBucket> {
    // Expects the key to be a GCP service account key
    let key: any = null;
    try {
      key = JSON.parse(credentials);
    } catch (e) {
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

  async getSignedUrl(
    location: string,
    action: BucketObjectAction,
    expiration: Date,
    contentType?: string | undefined
  ): Promise<string> {
    const file = this.storageBucket.file(location);

    const [url] = await file.getSignedUrl({
      action: this.actionToString(action),
      expires: expiration,
      contentType
    });
    return url;
  }

  async delete(location: string): Promise<void> {
    await this.deleteFiles(location);
  }

  async move(originalLocation: string, finalLocation: string): Promise<void> {
    const file = this.storageBucket.file(originalLocation);
    await file.move(finalLocation);
  }

  async exists(location: string): Promise<boolean> {
    const exists = await this.storageBucket.file(location).exists();
    return exists[0];
  }

  async getContentType(location: string): Promise<string | null> {
    const file = this.storageBucket.file(location);
    await file.getMetadata();
    return file.metadata.contentType || null;
  }

  async download(location: string): Promise<Buffer | null> {
    const file = this.storageBucket.file(location);
    return (await file.download())[0];
  }

  async deleteFiles(location: string): Promise<void> {
    await this.storageBucket.deleteFiles({ prefix: location });
  }

  async writeText(location: string, content: string): Promise<void> {
    // Create the file reference
    await this.storageBucket.file(location).save(content);
  }

  private actionToString(action: BucketObjectAction): 'read' | 'write' | 'delete' {
    switch (action) {
      case BucketObjectAction.READ:
        return 'read';
      case BucketObjectAction.WRITE:
        return 'write';
      case BucketObjectAction.DELETE:
        return 'delete';
      default:
        throw new Error(`Unsupported action ${action}`);
    }
  }
}
