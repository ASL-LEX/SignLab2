import { InputType, OmitType } from '@nestjs/graphql';
import { Project } from '../project.model';

@InputType()
export class ProjectCreate extends OmitType(Project, ['_id', 'created', 'organization'] as const, InputType) {}
