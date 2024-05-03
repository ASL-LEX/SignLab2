import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Entry } from '../../entry/models/entry.model';
import { Bucket } from '../../bucket/bucket';
import { JOB_PROVIDER } from '../../gcp/providers/job.provider';
import { JobsClient } from '@google-cloud/run';


export interface ZipJobRequest {
  /** Where to put the entry JSON file in the bucket */
  entryJSONLocation: string;

  /** The location in the bucket to put the zip */
  entryZIPLocation: string;

  /** Where the webhook payload should be placed */
  webhookPayloadLocation: string;

  /** The webhook payload */
  webhookPayload: string;

  /** The webhook endpoint */
  webhook: string;

  /** The entries that need to be zipped */
  entries: Entry[];

  /** The bucket to upload into */
  bucket: Bucket;

  /** The organization ID */
  organization: string;
}

@Injectable()
export class DownloadRequestService {
  /** Where in the organization bucket all downloads are stored */
  private readonly downloadPrefix: string = this.configService.getOrThrow<string>('downloads.bucketPrefix');
  /** The name of the GCP Job */
  private readonly zipJobName: string = this.configService.getOrThrow<string>('downloads.jobName');

  constructor(
    private readonly configService: ConfigService,
    @Inject(JOB_PROVIDER)
    private readonly jobsClient: JobsClient
  ) {}

  /** Get a bucket location for download requests given the filename */
  getBucketLocation(fileName: string): string {
    return `${this.downloadPrefix}/${fileName}`;
  }

  getPrefix(): string {
    return this.downloadPrefix;
  }

  async startZipJob(request: ZipJobRequest): Promise<void> {
    const mountPoint = `/buckets/${request.organization}`;

    // Get the location of each entry based on the prefix. This will be where the
    // entry is located for the GCP Cloud Run Job
    const entryLocations = request.entries.map((entry) => `${mountPoint}/${entry.bucketLocation}`);

    // Convert the list to a string for saving
    const entryContent: string = JSON.stringify({ 'entries': entryLocations });

    // Now upload the generated JSON file with the entry locations into the bucket
    await request.bucket.writeText(request.entryJSONLocation, entryContent);

    // Upload the webhook payload
    await request.bucket.writeText(request.webhookPayloadLocation, request.webhookPayload);

    // Trigger the cloud run job
    await this.jobsClient.runJob({
      name: this.zipJobName,
      overrides: {
        containerOverrides: [
          {
            args: [
              `--target_entries=${mountPoint}/${request.entryJSONLocation}`,
              `--output_zip=${mountPoint}/${request.entryZIPLocation}`,
              `--notification_webhook=http://localhost:3000`,
              `--webhook_payload=${mountPoint}/${request.webhookPayloadLocation}`
            ]
          }
        ]
      }
    });
  }
}
