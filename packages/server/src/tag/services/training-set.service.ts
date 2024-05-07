import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseMiddlewareService } from '../../shared/service/mongoose-callback.service';
import { Entry } from '../../entry/models/entry.model';
import { Study } from '../../study/study.model';
import { TrainingSet } from '../models/training-set';

@Injectable()
export class TrainingSetService {
  constructor(
    @InjectModel(TrainingSet.name) private readonly trainingSetModel: Model<TrainingSet>,
    middlewareService: MongooseMiddlewareService
  ) {
    middlewareService.register(Study.name, 'deleteOne', async (study: Study) => {
      await this.removeForStudy(study);
    });
  }

  async create(study: Study, entries: Entry[]): Promise<TrainingSet> {
    return this.trainingSetModel.create({
      study: study._id,
      entries: entries.map((entry) => entry._id)
    });
  }

  async findByStudy(study: Study): Promise<TrainingSet | null> {
    return this.trainingSetModel.findOne({ study: study._id });
  }

  private async removeForStudy(study: Study): Promise<void> {
    await this.trainingSetModel.deleteOne({ study: study._id });
  }
}
