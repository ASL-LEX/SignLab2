import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entry } from 'src/entry/models/entry.model';
import { VideoField, VideoFieldDocument } from '../models/video-field.model';

@Injectable()
export class VideoFieldService {
  constructor(@InjectModel(VideoField.name) private readonly videoFieldModel: Model<VideoFieldDocument>) {}

  async create(entries: Entry[]): Promise<VideoField> {
    const entryIDs = entries.map(entry => entry._id);

    return this.videoFieldModel.create({
      entries: entryIDs
    });
  }

  async find(id: string): Promise<VideoField | null> {
    return this.videoFieldModel.findById(id);
  }
}
