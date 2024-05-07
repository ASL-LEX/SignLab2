import { registerEnumType } from '@nestjs/graphql';

export enum DownloadStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY'
}

registerEnumType(DownloadStatus, {
  name: 'DownloadStatus'
});

/**
 * Standard representation of a download request. Different download
 * request types may track additional fields
 */
export interface DownloadRequest {
  organization: string;

  date: Date;

  status: DownloadStatus;

  entryZIPLocation?: string;

  bucketLocation?: string;

  entryJSONLocation?: string;

  webhookPayloadLocation?: string;
}
