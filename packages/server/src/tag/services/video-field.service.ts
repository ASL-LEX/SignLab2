import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VideoField, VideoFieldDocument } from '../models/video-field.model';
import { Model } from 'mongoose';
import { Tag } from '../models/tag.model';
import { StudyService } from '../../study/study.service';
import { ConfigService } from '@nestjs/config';
import { GCP_STORAGE_PROVIDER } from '../../gcp/providers/storage.provider';
import { Storage, Bucket } from '@google-cloud/storage';
import { Entry } from '../../entry/models/entry.model';
import { EntryService } from '../../entry/services/entry.service';
import {DatasetPipe} from '../../dataset/pipes/dataset.pipe';
import {TokenPayload} from '../../jwt/token.dto';

@Injectable()
export class VideoFieldService {
  private readonly bucketPrefix = this.configService.getOrThrow<string>('tag.videoFieldFolder');
  private readonly videoRecordFileType = this.configService.getOrThrow<string>('tag.videoRecordFileType');
  private readonly bucketName = this.configService.getOrThrow<string>('gcp.storage.bucket');
  private readonly bucket: Bucket = this.storage.bucket(this.bucketName);
  private readonly expiration = this.configService.getOrThrow<number>('tag.videoUploadExpiration');

  constructor(
    @InjectModel(VideoField.name) private readonly videoFieldModel: Model<VideoFieldDocument>,
    private readonly studyService: StudyService,
    private readonly configService: ConfigService,
    @Inject(GCP_STORAGE_PROVIDER) private readonly storage: Storage,
    private readonly entryService: EntryService,
    private readonly datasetPipe: DatasetPipe
  ) {}

  async saveVideoField(tag: Tag, field: string, index: number): Promise<VideoField> {
    // First do a correctness check to make sure the field shows up in the tag
    // TODO: Can do a correctness check on the index and using the UI schema as well
    const study = await this.studyService.findById(tag.study);
    if (!study) {
      // Unexpected error, got a tag with an invalid study
      throw new Error(`Study ${tag.study} not found on tag ${tag._id}`);
    }
    const dataSchema = study.tagSchema.dataSchema;
    if (!dataSchema.properties || !dataSchema.properties[field]) {
      // User is trying to save a video field that doesn't exist in the tag
      throw new BadRequestException(`Field ${field} not found in tag ${tag._id}`);
    }

    // Check if the video field already exists, if so return it
    const existingVideoField = await this.getVideoField(tag, field, index);
    if (existingVideoField) {
      return existingVideoField;
    }

    // Otherwise make a new one and return it
    return this.videoFieldModel.create({
      tag: tag._id,
      field,
      index,
      bucketLocation: this.getVideoFieldBucketLocation(tag._id, field, index)
    });
  }

  async getUploadURL(videoField: VideoField): Promise<string> {
    const file = this.bucket.file(this.getVideoFieldBucketLocation(videoField.tag, videoField.field, videoField.index));
    const [url] = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + this.expiration,
      contentType: 'video/webm'
    });
    return url;
  }

  /**
   * Move the video itself to the permanent storage location and create the
   * cooresponding entry.
   */
  async markComplete(videoFieldID: string, datasetID: string, user: TokenPayload): Promise<Entry> {
    const videoField = await this.videoFieldModel.findById(videoFieldID);
    if (!videoField) {
      throw new BadRequestException(`Video field ${videoFieldID} not found`);
    }

    const dataset = await this.datasetPipe.transform(datasetID);

    // Make the entry
    const entry = await this.entryService.create({
      entryID: 'TODO: Generate entry ID',
      contentType: 'video/webm',
      meta: {}
    }, dataset, user);

    // Move the video to the permanent location
    const source = this.bucket.file(videoField.bucketLocation);
    const newLocation = `${dataset.bucketPrefix}/${entry._id}.webm`;
    await source.move(newLocation);
    await this.entryService.setBucketLocation(entry, newLocation);
    entry.bucketLocation = newLocation;

    // Remove the video field
    await this.videoFieldModel.deleteOne({ _id: videoField._id });

    // Return the completed entry
    return entry;
  }

  private getVideoFieldBucketLocation(tagID: string, field: string, index: number): string {
    return `${this.bucketPrefix}/${tagID}/${field}/${index}.${this.videoRecordFileType}`;
  }

  private async getVideoField(tag: Tag, field: string, index: number): Promise<VideoField | null> {
    return this.videoFieldModel.findOne({ tag: tag._id, field, index }).exec();
  }
}
