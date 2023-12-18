import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntryUpload } from '../models/entry-upload.model';
import { Model } from 'mongoose';
import {UploadSession} from '../models/upload-session.model';

@Injectable()
export class EntryUploadService {
  constructor(@InjectModel(EntryUpload.name) private readonly entryUploadModel: Model<EntryUpload>) {}

  async create(entryUpload: EntryUpload): Promise<EntryUpload> {
    return this.entryUploadModel.create(entryUpload);
  }

  async deleteForSession(session: UploadSession): Promise<void> {
    await this.entryUploadModel.deleteMany({ session: session._id });
  }

  async findForSession(session: UploadSession): Promise<EntryUpload[]> {
    return this.entryUploadModel.find({ session: session._id }).exec();
  }
}
