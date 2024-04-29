import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DownloadRequestService {
  private readonly downloadPrefix: string = this.configService.getOrThrow<string>('downloads.bucketPrefix');

  constructor(private readonly configService: ConfigService) {}

  /** Get a bucket location for download requests given the filename */
  getBucketLocation(fileName: string): string {
    return `${this.downloadPrefix}/${fileName}`;
  }

  getPrefix(): string {
    return this.downloadPrefix;
  }
}
