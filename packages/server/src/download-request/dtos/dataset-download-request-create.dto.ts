import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';

@InputType()
export class CreateDatasetDownloadRequest extends OmitType(
  DatasetDownloadRequest,
  ['_id', 'date', 'status'] as const,
  InputType
) {
  @Field(() => ID)
  dataset: string;
}
