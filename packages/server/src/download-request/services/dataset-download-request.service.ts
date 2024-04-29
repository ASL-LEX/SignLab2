import { JobsClient } from '@google-cloud/run';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BucketObjectAction } from 'src/bucket/bucket';
import { Dataset } from 'src/dataset/dataset.model';
import { JOB_PROVIDER } from 'src/gcp/providers/job.provider';
import { BucketFactory } from '../../bucket/bucket-factory.service';
import { EntryService } from '../../entry/services/entry.service';
import { Organization } from '../../organization/organization.model';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';
import { DownloadRequest, DownloadStatus } from '../models/download-request.model';
import { DownloadRequestService } from './download-request.service';

@Injectable()
export class DatasetDownloadService {
  private readonly zipJobName: string = this.configService.getOrThrow<string>('downloads.jobName');
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');

  constructor(
    @InjectModel(DatasetDownloadRequest.name)
    private readonly downloadRequestModel: Model<DatasetDownloadRequest>,
    private readonly downloadService: DownloadRequestService,
    private readonly entryService: EntryService,
    private readonly bucketFactory: BucketFactory,
    @Inject(JOB_PROVIDER) private readonly jobsClient: JobsClient,
    private readonly configService: ConfigService
  ) {}

  async createDownloadRequest(
    downloadRequest: CreateDatasetDownloadRequest,
    organization: Organization
  ): Promise<DatasetDownloadRequest> {
    let request = await this.downloadRequestModel.create({
      ...downloadRequest,
      date: new Date(),
      status: DownloadStatus.IN_PROGRESS,
      organization: organization._id
    });

    const bucketLocation = `${this.downloadService.getPrefix()}/${request._id}`;

    // Get the location to store the ZIPed entries
    const zipLocation = `${bucketLocation}/entries.zip`;
    const entryJSONLocation = `${bucketLocation}/entries.json`;
    const webhookPayloadLocation = `${bucketLocation}/webhook.json`;

    await this.downloadRequestModel.updateOne(
      { _id: request._id },
      {
        $set: {
          bucketLocation: bucketLocation,
          entryZIPLocation: zipLocation,
          entryJSONLocation: entryJSONLocation,
          webhookPayloadLocation: webhookPayloadLocation
        }
      }
    );
    request = (await this.downloadRequestModel.findById(request._id))!;

    // Start the process of zipping the entries
    await this.startZipJob(request);

    return request;
  }

  async getDatasetDownloadRequests(dataset: Dataset): Promise<DatasetDownloadRequest[]> {
    return this.downloadRequestModel.find({
      dataset: dataset._id
    });
  }

  async getEntryZipURL(downloadRequest: DownloadRequest): Promise<string> {
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw new Error(`Missing bucket for organization ${downloadRequest.organization}`);
    }
    return bucket.getSignedUrl(
      downloadRequest.entryZIPLocation!,
      BucketObjectAction.READ,
      new Date(Date.now() + this.expiration)
    );
  }

  private async startZipJob(downloadRequest: DatasetDownloadRequest): Promise<void> {
    // First, get the entries that need to be zipped
    const entries = await this.entryService.findForDataset(downloadRequest.dataset);
    const entryLocations = entries.map((entry) => `/buckets/${downloadRequest.organization}/${entry.bucketLocation}`);

    // Make the content of the entry request file
    const entryContent: string = JSON.stringify({ entries: entryLocations });

    // Get the bucket for uploading supporting files
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw Error(`Bucket not found for organization ${downloadRequest.organization}`);
    }

    // Write in the entries file
    await bucket.writeText(downloadRequest.entryJSONLocation!, entryContent);

    // Upload the webhook payload
    // TODO: Update webhook
    await bucket.writeText(
      downloadRequest.webhookPayloadLocation!,
      JSON.stringify({
        code: '1234',
        downloadRequest: '12'
      })
    );

    // Trigger the cloud run job
    await this.jobsClient.runJob({
      name: this.zipJobName,
      overrides: {
        containerOverrides: [
          {
            args: [
              `--target_entries=/buckets/${downloadRequest.organization}/${downloadRequest.entryJSONLocation!}`,
              `--output_zip=/buckets/${downloadRequest.organization}/${downloadRequest.entryZIPLocation!}`,
              `--notification_webhook=http://localhost:3000`,
              `--webhook_payload=/buckets/${downloadRequest.organization}/${downloadRequest.webhookPayloadLocation!}`
            ]
          }
        ]
      }
    });
  }
}
