import { InputType, OmitType } from '@nestjs/graphql';
import { Dataset } from '../dataset.model';

@InputType()
export class DatasetCreate extends OmitType(Dataset, ['_id', 'organization'] as const, InputType) {}
