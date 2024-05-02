import { Injectable, Inject } from '@nestjs/common';
import { StudyDownloadRequest } from '../models/study-download-request.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudyDownloadRequest } from '../dtos/study-download-request-create.dto';
import { DownloadStatus } from '../models/download-request.model';
import { Organization } from '../../organization/organization.model';
import { DownloadRequestService } from './download-request.service';
import { EntryService } from '../../entry/services/entry.service';
import { BucketFactory } from '../../bucket/bucket-factory.service';
import { JOB_PROVIDER } from 'src/gcp/providers/job.provider';
import { JobsClient } from '@google-cloud/run';
import { ConfigService } from '@nestjs/config';
import { TagService } from '../../tag/services/tag.service';
import { TagFieldType } from '../../tag/models/tag-field.model';
import { VideoFieldService } from '../../tag/services/video-field.service';

@Injectable()
export class StudyDownloadService {
  private readonly zipJobName: string = this.configService.getOrThrow<string>('downloads.jobName');

  constructor(
    @InjectModel(StudyDownloadRequest.name)
    private readonly downloadRequestModel: Model<StudyDownloadRequest>,
    private readonly downloadService: DownloadRequestService,
    private readonly entryService: EntryService,
    private readonly bucketFactory: BucketFactory,
    @Inject(JOB_PROVIDER)
    private readonly jobsClient: JobsClient,
    private readonly configService: ConfigService,
    private readonly tagService: TagService,
    private readonly videoFieldService: VideoFieldService
  ) {}


  async createDownloadRequest(downloadRequest: CreateStudyDownloadRequest, organization: Organization): Promise<StudyDownloadRequest> {
    let request = await this.downloadRequestModel.create({
      ...downloadRequest,
      date: new Date(),
      status: DownloadStatus.IN_PROGRESS,
      organization: organization._id
    });

    const bucketLocation = `${this.downloadService.getPrefix()}/${request._id}`;

    // Create the locations for all the artifacts
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

    // await this.startZipJob(request);
    await this.generateCSV(request);

    return request;
  }

  /**
   * Handles generating the CSV for the tag data
   */
  private async generateCSV(downloadRequest: StudyDownloadRequest): Promise<void> {
    const tags = await this.tagService.getCompleteTags(downloadRequest.study);

    const converted: any[] = [];

    for (const tag of tags) {
      const tagFields: any = {};

      for (const field of tag.data!) {

        // For video fields, each entry is represented by the filename
        if (field.type == TagFieldType.VIDEO_RECORD) {
          const videoField = (await this.videoFieldService.find(field.data))!;
          for (let index = 0; index < videoField.entries.length; index++) {
            const entryID = videoField.entries[index];
            const entry = (await this.entryService.find(entryID))!;
            tagFields[`${field.name}-${index}`] = entry.bucketLocation.split('/').pop();
          }
        } else {
          tagFields[`${field.name}`] = field.data;
        }

      }
      converted.push(tagFields);
    }

    console.log(converted);

    // Convert the tag fields into a list of objects
    // const tagData = JSON.stringify(tags);
    // console.log(tagData);

  }

  private async startZipJob(downloadRequest: StudyDownloadRequest): Promise<void> {
    // First, get the entries that need to be zipped
    const entries = await this.entryService.getEntriesForStudy(downloadRequest.study);
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
