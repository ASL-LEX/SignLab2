import { Injectable } from '@nestjs/common';
import { StudyDownloadRequest } from '../models/study-download-request.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class StudyDownloadService {
  constructor(
    @InjectModel(StudyDownloadRequest.name)
    private readonly downloadRequestMode: Model<StudyDownloadRequest>
  ) {}


  async createDownloadRequest() {

  }
}
