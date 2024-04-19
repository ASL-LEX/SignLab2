import { BadRequestException, Injectable } from '@nestjs/common';
import { FieldTransformer } from './field-transformer';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { VideoFieldIntermediateService } from '../services/video-field-inter.service';
import { TokenPayload } from '../../jwt/token.dto';
import { Tag } from '../models/tag.model';
import { TagField, TagFieldType } from '../models/tag-field.model';
import { VideoFieldService } from '../services/video-field.service';

@Injectable()
export class VideoFieldTransformer implements FieldTransformer {
  constructor(
    private readonly videoFieldIntermediateService: VideoFieldIntermediateService,
    private readonly vidoeFieldService: VideoFieldService
  ) {}

  async transformField(
    tag: Tag,
    data: string[],
    uischema: UISchemaElement,
    _schema: JsonSchema,
    user: TokenPayload,
    property: string
  ): Promise<TagField> {
    const datasetID = uischema.options?.dataset;
    if (!datasetID) {
      throw new BadRequestException('Dataset ID not provided');
    }

    // Mark the intermediate video fields as complete
    const entries = await Promise.all(
      data.map(async (videoFieldId) => {
        return this.videoFieldIntermediateService.markComplete(videoFieldId, datasetID, user, tag);
      })
    );

    // Create the complete video field
    const videoField = await this.vidoeFieldService.create(entries);

    return {
      name: property,
      data: videoField._id,
      type: TagFieldType.VIDEO_RECORD
    };
  }
}

export const VideoFieldTransformerTest = (uischema: UISchemaElement, _schema: JsonSchema) => {
  if (uischema.options && uischema.options.customType && uischema.options.customType === 'video') {
    return 10;
  }
  return -1;
};
