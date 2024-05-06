import { Injectable } from '@nestjs/common';
import { StudyDownloadField, StudyDownloadRequest } from '../models/study-download-request.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudyDownloadRequest } from '../dtos/study-download-request-create.dto';
import { DownloadStatus } from '../models/download-request.model';
import { Organization } from '../../organization/organization.model';
import { DownloadRequestService } from './download-request.service';
import { EntryService } from '../../entry/services/entry.service';
import { BucketFactory } from '../../bucket/bucket-factory.service';
import { ConfigService } from '@nestjs/config';
import { TagService } from '../../tag/services/tag.service';
import { TagFieldType } from '../../tag/models/tag-field.model';
import { VideoFieldService } from '../../tag/services/video-field.service';
import { BucketObjectAction } from 'src/bucket/bucket';
import { Entry } from 'src/entry/models/entry.model';
import { Study } from 'src/study/study.model';

@Injectable()
export class StudyDownloadService {
  private readonly expiration = this.configService.getOrThrow<number>('entry.signedURLExpiration');

  constructor(
    @InjectModel(StudyDownloadRequest.name)
    private readonly downloadRequestModel: Model<StudyDownloadRequest>,
    private readonly downloadService: DownloadRequestService,
    private readonly entryService: EntryService,
    private readonly bucketFactory: BucketFactory,
    private readonly configService: ConfigService,
    private readonly tagService: TagService,
    private readonly videoFieldService: VideoFieldService
  ) {}

  async createDownloadRequest(
    downloadRequest: CreateStudyDownloadRequest,
    organization: Organization
  ): Promise<StudyDownloadRequest> {
    let request = await this.downloadRequestModel.create({
      ...downloadRequest,
      date: new Date(),
      status: DownloadStatus.IN_PROGRESS,
      organization: organization._id,
      entryZipComplete: false,
      taggedEntryZipComplete: false
    });

    const bucketLocation = `${this.downloadService.getPrefix()}/${request._id}`;

    // Create the locations for all the artifacts
    const zipLocation = `${bucketLocation}/entries.zip`;
    const entryJSONLocation = `${bucketLocation}/entries.json`;
    const webhookPayloadLocation = `${bucketLocation}/webhook.json`;
    const tagCSVLocation = `${bucketLocation}/tag.csv`;
    const taggedEntriesZipLocation = `${bucketLocation}/tagged_entries.zip`;
    const taggedEntriesJSONLocation = `${bucketLocation}/tagged_entries.json`;
    const taggedEntryWebhookPayloadLocation = `${bucketLocation}/tagged_entries_webhook.json`;

    await this.downloadRequestModel.updateOne(
      { _id: request._id },
      {
        $set: {
          bucketLocation: bucketLocation,
          entryZIPLocation: zipLocation,
          entryJSONLocation: entryJSONLocation,
          webhookPayloadLocation: webhookPayloadLocation,
          tagCSVLocation: tagCSVLocation,
          taggedEntriesZipLocation: taggedEntriesZipLocation,
          taggedEntriesJSONLocation: taggedEntriesJSONLocation,
          taggedEntryWebhookPayloadLocation: taggedEntryWebhookPayloadLocation
        }
      }
    );
    request = (await this.downloadRequestModel.findById(request._id))!;

    // Download the entries that were generated as part of this study
    await this.downloadService.startZipJob({
      entryJSONLocation: request.entryJSONLocation!,
      entryZIPLocation: request.entryZIPLocation!,
      webhookPayloadLocation: request.webhookPayloadLocation!,
      webhookPayload: JSON.stringify({ test: 'hello' }),
      webhook: 'http://localhost:3000',
      entries: await this.entryService.getEntriesForStudy(request.study),
      bucket: (await this.bucketFactory.getBucket(request.organization))!,
      organization: request.organization
    });
    // Download the tag data as a CSV
    await this.generateCSV(request);
    // Download the entries that were tagged in this study
    await this.downloadService.startZipJob({
      entryJSONLocation: request.taggedEntriesJSONLocation!,
      entryZIPLocation: request.taggedEntriesZipLocation!,
      webhookPayloadLocation: request.taggedEntryWebhookPayloadLocation!,
      webhookPayload: JSON.stringify({ test: 'hello' }),
      webhook: 'http://localhost:3000',
      entries: await this.getLabeledEntries(request),
      bucket: (await this.bucketFactory.getBucket(request.organization))!,
      organization: request.organization
    });

    return request;
  }

  async getStudyDownloads(study: Study): Promise<StudyDownloadRequest[]> {
    return this.downloadRequestModel.find({ study: study._id });
  }

  async find(id: string): Promise<StudyDownloadRequest | null> {
    return this.downloadRequestModel.findById(id);
  }

  /**
   * Handles flagging when a field is complete and then updating the status when all fields are complete
   */
  async markStudyFieldComplete(downloadRequest: StudyDownloadRequest, studyField: StudyDownloadField): Promise<void> {
    // Mark the field as complete
    switch(studyField) {
      case StudyDownloadField.ENTRY_ZIP:
        this.downloadRequestModel.updateOne({ _id: downloadRequest._id }, { $set: { entryZipComplete: true }});
        break;
      case StudyDownloadField.TAGGED_ENTRIES_ZIP:
        this.downloadRequestModel.updateOne({ _id: downloadRequest._id }, { $set: { taggedEntryZipComplete: true }});
        break;
      default:
        throw new Error(`Unknown field ${studyField}`);
    }

    const request = (await this.downloadRequestModel.findById(downloadRequest._id))!;

    // Check if all components are complete
    if (request.taggedEntryZipComplete && request.entryZipComplete) {
      // Mark as complete
      this.downloadRequestModel.updateOne({ _id: request._id }, { $set: { status: DownloadStatus.READY }});
    }
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

      // Add basic meta-fields
      tagFields['prompt'] = (await this.entryService.find(tag.entry))!.bucketLocation.split('/').pop();

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
    return this.getSignedURL(downloadRequest, downloadRequest.entryZIPLocation!);
  }

  async getTagCSVUrl(downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.getSignedURL(downloadRequest, downloadRequest.tagCSVLocation!);
  }

  async getTaggedEntriesUrl(downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.getSignedURL(downloadRequest, downloadRequest.taggedEntriesZipLocation!);
  }

  private async getSignedURL(downloadRequest: StudyDownloadRequest, location: string): Promise<string> {
    const bucket = await this.bucketFactory.getBucket(downloadRequest.organization);
    if (!bucket) {
      throw new Error(`Bucket not found for organization ${downloadRequest.organization}`);
    }
    return bucket.getSignedUrl(location, BucketObjectAction.READ, new Date(Date.now() + this.expiration));
  }

  /**
   * TODO: Improve the CSV process, need a better method to determine the headers and handle default values
   */
  private convertToCSV(arr: any[]): string {
    const array = [Object.keys(arr[0])].concat(arr);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join('\n');
  }

  /**
   * Get the entries taged as part of the study
   */
  private async getLabeledEntries(downloadRequest: StudyDownloadRequest): Promise<Entry[]> {
    // Get the complete tags
    const tags = await this.tagService.getCompleteTags(downloadRequest.study);

    // Get the entries, make sure they are unique
    let entryIDs: string[] = tags.map((tag) => tag.entry);
    entryIDs = Array.from(new Set(entryIDs));

    // Get all the entries
    return Promise.all(
      entryIDs.map(async (id) => {
        const entry = await this.entryService.find(id);
        if (!entry) {
          throw new Error(`Invalid id for entry: ${id}`);
        }
        return entry;
      })
    );
  }
}
