import { BadRequestException, Injectable } from '@nestjs/common';
import { FieldTransformer } from './field-transformer';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { VideoFieldService } from '../services/video-field.service';
import { TokenPayload } from '../../jwt/token.dto';

@Injectable()
export class VideoFieldTransformer implements FieldTransformer {
  constructor(private readonly videoFieldService: VideoFieldService) {}

  async transformField (data: string[], uischema: UISchemaElement, _schema: JsonSchema, user: TokenPayload): Promise<any> {
    const datasetID = uischema.options?.dataset;
    if (!datasetID) {
      throw new BadRequestException('Dataset ID not provided');
    }

    const videoFields = await Promise.all(data.map(async (videoFieldId) => {
      const entry = await this.videoFieldService.markComplete(videoFieldId, datasetID, user);
      return entry._id;
    }));

    return videoFields;
  }
}

export const VideoFieldTransformerTest = (uischema: UISchemaElement, _schema: JsonSchema) => {
  if (uischema.options && uischema.options.customType && uischema.options.customType === 'video') {
    return 10;
  }
  return -1;
};
