import { StudyCreate } from '../graphql/graphql';

/** Information to create a new study minus the schema */
export interface PartialStudyCreate extends Omit<StudyCreate, 'tagSchema' | 'project'> {}
