import { Injectable } from '@nestjs/common';
import { UploadSession } from '../models/upload-session.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Dataset} from 'src/dataset/dataset.model';

@Injectable()
export class UploadSessionService {
  constructor(@InjectModel(UploadSession.name) private readonly uploadSessionModel: Model<UploadSession>) {}

  async find(id: string): Promise<UploadSession | null> {
    return this.uploadSessionModel.findById(id).exec();
  }

  async create(dataset: Dataset): Promise<UploadSession> {
    // TODO: Remove old session along with all uploads

    return this.uploadSessionModel.create({
      dataset: dataset._id,
      created: new Date()
    });
  }
}
