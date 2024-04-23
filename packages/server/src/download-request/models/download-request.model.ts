export enum DownloadStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY'
}

/**
 * Standard representation of a download request. Different download
 * request types may track additional fields
 */
export interface DownloadRequest {
  organization: string;

  date: Date;

  status: DownloadStatus;

  entryZIPLocation: string;
}
