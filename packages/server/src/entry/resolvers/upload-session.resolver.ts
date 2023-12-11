import { Injectable } from '@nestjs/common';
import { UploadSession } from '../models/upload-session.model';
import { UploadSessionService } from '../services/upload-session.service';
import { Dataset } from '../../dataset/dataset.model';

@Injectable()
export class UploadSessionResolver {
  constructor(private readonly uploadSessionService: UploadSessionService) {}

  async createUploadSession(dataset: Dataset): Promise<UploadSession> {
    return this.uploadSessionService.create(dataset);
  }
}
