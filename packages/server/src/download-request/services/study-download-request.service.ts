import { Injectable } from '@nestjs/common';
import { StudyDownloadRequest } from '../models/study-download-request.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudyDownloadRequest } from '../dtos/study-download-request-create.dto';


@Injectable()
export class StudyDownloadService {
  constructor(
    @InjectModel(StudyDownloadRequest.name)
    private readonly downloadRequestModel: Model<StudyDownloadRequest>
  ) {}


  async createDownloadRequest(downloadRequest: CreateStudyDownloadRequest) {

  }
}
