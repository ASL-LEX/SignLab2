import { Injectable } from '@nestjs/common';
import { Study } from '../../study/study.model';

/**
 * Service which handles storing and applying functions which are called when
 * a study is deleted. Since the Mongoose Middleware needs to be registered
 * before the module is loaded, this intermediate service is used to
 * seperate the storage of the callback functions from the module itself
 */
@Injectable()
export class StudyDeletionService {
  private onDeleteFunctions: ((study: Study) => Promise<void>)[] = [];

  registerOnDelete(callback: (study: Study) => Promise<void>) {
    this.onDeleteFunctions.push(callback);
  }

  async apply(study: Study): Promise<void> {
    await Promise.all(this.onDeleteFunctions.map((callback) => callback(study)));
  }
}
