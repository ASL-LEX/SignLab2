import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntryUpload } from '../models/entry-upload.model';
import { Model } from 'mongoose';

@Injectable()
export class EntryUploadService {
  constructor(@InjectModel(EntryUpload.name) private readonly entryUploadModel: Model<EntryUpload>) {}

  async create(entryUpload: EntryUpload): Promise<EntryUpload> {
    return this.entryUploadModel.create(entryUpload);
  }
}
