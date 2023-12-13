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
    await this.deleteOldSession(dataset);

    // Make the session
    const uploadSession = await this.uploadSessionModel.create({
      dataset: dataset._id,
      created: new Date(),
    });

    // Add in the bucket prefix for the session
    uploadSession.bucketPrefix = `/upload-session/${uploadSession._id}`;

    // Save the session
    await uploadSession.save();

    return uploadSession;
  }

  async complete(uploadSession: UploadSession): Promise<void> {
    // TODO: Implement completion logic
  }

  /** Generate the presigned URL for where to upload the CSV against */
  async getCSVUploadURL(uploadSession: UploadSession): Promise<string> {

    return 'TODO';
  }

  // TODO: Provide user information
  private async deleteOldSession(dataset: Dataset): Promise<void> {
    await this.uploadSessionModel.deleteMany({ dataset: dataset._id }).exec();
  }
}
