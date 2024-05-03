import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BucketObjectAction } from 'src/bucket/bucket';
import { Dataset } from 'src/dataset/dataset.model';
import { BucketFactory } from '../../bucket/bucket-factory.service';
import { EntryService } from '../../entry/services/entry.service';
import { Organization } from '../../organization/organization.model';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';
import { DownloadRequest, DownloadStatus } from '../models/download-request.model';
import { DownloadRequestService } from './download-request.service';

@Injectable()
export class DatasetDownloadService {
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');

  constructor(
    @InjectModel(DatasetDownloadRequest.name)
    private readonly downloadRequestModel: Model<DatasetDownloadRequest>,
    private readonly downloadService: DownloadRequestService,
    private readonly entryService: EntryService,
    private readonly bucketFactory: BucketFactory,
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
    await this.downloadService.startZipJob({
      entryJSONLocation: request.entryJSONLocation!,
      entryZIPLocation: request.entryZIPLocation!,
      webhookPayloadLocation: request.webhookPayloadLocation!,
      webhookPayload: JSON.stringify({ test: 'hello' }),
      webhook: 'http://localhost:3000/',
      entries: await this.entryService.findForDataset(request.dataset),
      bucket: (await this.bucketFactory.getBucket(request.organization))!,
      organization: request.organization
    });

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
}
