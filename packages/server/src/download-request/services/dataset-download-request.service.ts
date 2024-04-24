import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';

@Injectable()
export class DatasetDownloadService {
  constructor(@InjectModel(DatasetDownloadRequest.name) private readonly downloadRequestModel: Model<DatasetDownloadRequest>) {}

  async createDownloadRequest(downloadRequest: CreateDatasetDownloadRequest): Promise<DatasetDownloadRequest> {
    return this.downloadRequestModel.create({
      ...downloadRequest,
      date: new Date()
    })
  }
}
