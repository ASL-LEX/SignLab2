import { Field, ID, InputType, OmitType } from '@nestjs/graphql';
import { StudyDownloadRequest } from '../models/study-download-request.model';

@InputType()
export class CreateStudyDownloadRequest extends OmitType(StudyDownloadRequest, ['_id', 'date', 'status'] as const, InputType) {
  @Field(() => ID)
  study: string;
}
