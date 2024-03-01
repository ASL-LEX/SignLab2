import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry } from '../../entry/models/entry.model';
import { Study } from '../../study/study.model';
import { TrainingSet } from '../models/training-set';

@Injectable()
export class TrainingSetService {
  constructor(@InjectModel(TrainingSet.name) private readonly trainingSetModel: Model<TrainingSet>) {}

  async create(study: Study, entries: Entry[]): Promise<TrainingSet> {
    return this.trainingSetModel.create({
      study: study._id,
      entries: entries.map((entry) => entry._id)
    });
  }
}
