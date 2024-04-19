import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VideoFieldIntermediate, VideoFieldIntermediateDocument } from '../models/video-field-inter.model';
import { Model } from 'mongoose';
import { Tag } from '../models/tag.model';
import { StudyService } from '../../study/study.service';
import { ConfigService } from '@nestjs/config';
import { Entry } from '../../entry/models/entry.model';
import { EntryService } from '../../entry/services/entry.service';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { TokenPayload } from '../../jwt/token.dto';
import { Dataset } from '../../dataset/dataset.model';
import { BucketFactory } from 'src/bucket/bucket-factory.service';
import { BucketObjectAction } from 'src/bucket/bucket';

@Injectable()
export class VideoFieldIntermediateService {
  private readonly bucketPrefix = this.configService.getOrThrow<string>('tag.videoFieldFolder');
  private readonly videoRecordFileType = this.configService.getOrThrow<string>('tag.videoRecordFileType');
  private readonly expiration = this.configService.getOrThrow<number>('tag.videoUploadExpiration');
  private readonly trainingPrefix = this.configService.getOrThrow<string>('tag.trainingPrefix');

  constructor(
    @InjectModel(VideoFieldIntermediate.name) private readonly videoFieldModel: Model<VideoFieldIntermediateDocument>,
    private readonly studyService: StudyService,
    private readonly configService: ConfigService,
    private readonly entryService: EntryService,
    private readonly datasetPipe: DatasetPipe,
    private readonly bucketFactory: BucketFactory
  ) {}

  async saveVideoField(tag: Tag, field: string, index: number): Promise<VideoFieldIntermediate> {
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
      bucketLocation: this.getVideoFieldBucketLocation(tag._id, field, index),
      organization: study.organization
    });
  }

  async getUploadURL(videoField: VideoFieldIntermediate): Promise<string> {
    const bucket = await this.bucketFactory.getBucket(videoField.organization);
    if (!bucket) {
      throw new Error('Could not find bucket for video field');
    }

    const file = this.getVideoFieldBucketLocation(videoField.tag, videoField.field, videoField.index);
    const url = await bucket.getSignedUrl(
      file,
      BucketObjectAction.WRITE,
      new Date(Date.now() + this.expiration),
      'video/webm'
    );
    return url;
  }

  /**
   * Move the video itself to the permanent storage location and create the
   * cooresponding entry.
   */
  async markComplete(videoFieldID: string, datasetID: string, user: TokenPayload, tag: Tag): Promise<Entry> {
    const videoField = await this.videoFieldModel.findById(videoFieldID);
    if (!videoField) {
      throw new BadRequestException(`Video field ${videoFieldID} not found`);
    }
    const bucket = await this.bucketFactory.getBucket(videoField.organization);
    if (!bucket) {
      throw new Error('Could not find bucket for video field');
    }

    // The dataset that the entry would be associated with
    const dataset: Dataset = await this.datasetPipe.transform(datasetID);

    // Make the entry
    const entry = await this.entryService.create(
      {
        entryID: 'TODO: Generate entry ID',
        contentType: 'video/webm',
        meta: {}
      },
      dataset,
      user,
      tag.training
    );

    // Where to move the entry video
    let newLocation = `${dataset.bucketPrefix}/${entry._id}.webm`;
    if (tag.training) {
      newLocation = `${this.trainingPrefix}/${dataset.organization}/${tag.study}/${entry._id}.webm`;
    }

    // Move the video to the permanent location
    await bucket.move(videoField.bucketLocation, newLocation);
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

  private async getVideoField(tag: Tag, field: string, index: number): Promise<VideoFieldIntermediate | null> {
    return this.videoFieldModel.findOne({ tag: tag._id, field, index }).exec();
  }
}
