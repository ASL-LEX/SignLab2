import { InputType, OmitType } from '@nestjs/graphql';
import { Organization } from '../organization.model';

@InputType()
export class OrganizationCreate extends OmitType(Organization, ['_id'] as const, InputType) {}
