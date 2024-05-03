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
import { BucketObjectAction } from 'src/bucket/bucket';

@Injectable()
export class StudyDownloadService {
  private readonly zipJobName: string = this.configService.getOrThrow<string>('downloads.jobName');
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');


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
    const tagCSVLocation = `${bucketLocation}/tag.csv`;

    await this.downloadRequestModel.updateOne(
      { _id: request._id },
      {
        $set: {
          bucketLocation: bucketLocation,
          entryZIPLocation: zipLocation,
          entryJSONLocation: entryJSONLocation,
          webhookPayloadLocation: webhookPayloadLocation,
          tagCSVLocation: tagCSVLocation
        }
      }
    );
    request = (await this.downloadRequestModel.findById(request._id))!;

    // Download the entries that were generated as part of this study
    await this.startZipJob(request);
    // Download the tag data as a CSV
    await this.generateCSV(request);
    // Download the entries that were tagged in this study

    return request;
  }

  /**
   * Handles generating the CSV for the tag data. This approach is a sub-optimal one.
   *
   * The overall need is to convert the tag information into a flat CSV format where
   * any external information (like videos that are downloaded as a zip) can be associated
   * with the data.
   *
   * For example, video fields need to be linked to the videos that are downloaded,
   * therefore the video fields show up as multiple columns, one for each video recorded.
   *
   * This approach is sub-optimal for a number of reasons
   * 1. The code should be isolated into different handlers that each know how to make
   *    the CSV representation for that field.
   * 2. Expansion of video fields can be time consuming. This may need to be a process
   *    that runs in the background.
   * 3. ASL-LEX fields are not expanded. Currently only the ID of the field will be
   *    stored
   */
  private async generateCSV(downloadRequest: StudyDownloadRequest): Promise<void> {
    const tags = await this.tagService.getCompleteTags(downloadRequest.study);

    // Turn the tag fields into their "CSV-friendly" format
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

    // Convert the data into a CSV
    const dataString = this.convertToCSV(converted);

    // Store the CSV in the expected location in the bucket
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw new Error(`No bucket found for organization ${downloadRequest.organization}`);
    }
    await bucket.writeText(downloadRequest.tagCSVLocation!, dataString);
  }

  async getEntryZipUrl(downloadRequest: StudyDownloadRequest): Promise<string> {
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw new Error(`Bucket not found for organization ${downloadRequest.organization}`);
    }
    return bucket.getSignedUrl(
      downloadRequest.entryZIPLocation!,
      BucketObjectAction.READ,
      new Date(Date.now() + this.expiration)
    )
  }

  private convertToCSV(arr: any[]): string {
    const array = [Object.keys(arr[0])].concat(arr)

    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
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
