import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BucketFactory } from '../../bucket/bucket-factory.service';
import { EntryService } from '../../entry/services/entry.service';
import { Organization } from '../../organization/organization.model';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';
import { DownloadStatus } from '../models/download-request.model';
import { DownloadRequestService } from './download-request.service';

@Injectable()
export class DatasetDownloadService {
  constructor(
    @InjectModel(DatasetDownloadRequest.name)
    private readonly downloadRequestModel: Model<DatasetDownloadRequest>,
    private readonly downloadService: DownloadRequestService,
    private readonly entryService: EntryService,
    private readonly bucketFactory: BucketFactory
  ) {}

  async createDownloadRequest(downloadRequest: CreateDatasetDownloadRequest, organization: Organization): Promise<DatasetDownloadRequest> {
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

    await this.downloadRequestModel.updateOne(
      { _id: request._id },
      {
        $set: {
          bucketLocation: bucketLocation,
          entryZIPLocation: zipLocation,
          entryJSONLocation: entryJSONLocation
        }
      }
    );
    request = (await this.downloadRequestModel.findById(request._id))!;

    // Start the process of zipping the entries
    await this.startZipJob(request);

    return request;
  }

  private async startZipJob(downloadRequest: DatasetDownloadRequest): Promise<void> {
    // First, get the entries that need to be zipped
    const entries = await this.entryService.findForDataset(downloadRequest.dataset);
    const entryIDs = entries.map((entry) => entry._id);

    // Make the content of the entry request file
    const entryContent: string = JSON.stringify({ entries: entryIDs });

    // Upload the file to the download request location
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw Error(`Bucket not found for organization ${downloadRequest.organization}`);
    }

    await bucket.writeText(downloadRequest.entryJSONLocation!, entryContent);
  }
}
