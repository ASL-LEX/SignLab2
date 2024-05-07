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
import { DatasetDownloadField, DatasetDownloadRequest } from '../models/dataset-download-request.model';
import { DownloadRequest, DownloadStatus } from '../models/download-request.model';
import { DownloadRequestService } from './download-request.service';
import { randomUUID } from 'crypto';

@Injectable()
export class DatasetDownloadService {
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');
  private readonly gatewayEndpoint = this.configService.getOrThrow<string>('endpoints.gateway');

  /** The mutation to execute for marking a field as complete */
  private readonly markCompleteMutation = `
    mutation markDatasetFieldComplete($downloadRequest: ID!, $datasetField: DatasetDownloadField!, $code: String!) {
      markDatasetFieldComplete(downloadRequest: $downloadRequest, datasetField: $datasetField, code: $code)
    }
  `;

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
      organization: organization._id,
      entryZipComplete: false,
      verificationCode: randomUUID()
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
      webhookPayload: JSON.stringify({
        query: this.markCompleteMutation,
        variables: {
          downloadRequest: request._id,
          datasetField: DatasetDownloadField.ENTRY_ZIP.toString(),
          code: request.verificationCode
        }
      }),
      webhook: this.gatewayEndpoint,
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

  async find(id: string): Promise<DatasetDownloadRequest | null> {
    return this.downloadRequestModel.findById({ _id: id });
  }

  async markFieldComplete(downloadRequest: DatasetDownloadRequest, field: DatasetDownloadField): Promise<void> {
    switch (field) {
      case DatasetDownloadField.ENTRY_ZIP:
        await this.downloadRequestModel.updateOne({ _id: downloadRequest._id }, { $set: { entryZipComplete: true } });
        break;
      default:
        throw new Error(`Unknown dataset download field ${field}`);
    }

    // With only one field supported, can mark the download as complete
    await this.downloadRequestModel.updateOne({ _id: downloadRequest._id }, { $set: { status: DownloadStatus.READY } });
  }
}
