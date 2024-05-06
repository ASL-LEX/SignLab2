import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';
import { DatasetDownloadService } from '../services/dataset-download-request.service';

@Injectable()
export class DatasetDownloadRequestPipe implements PipeTransform<string, Promise<DatasetDownloadRequest>> {
  constructor(private readonly downloadRequestService: DatasetDownloadService) {}

  async transform(value: string): Promise<DatasetDownloadRequest> {
    const downloadRequest = await this.downloadRequestService.find(value);
    if (!downloadRequest) {
      throw new BadRequestException(`Dataset download request with id ${value} not found`);
    }
    return downloadRequest;
  }
}
