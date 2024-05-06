import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { StudyDownloadRequest } from '../models/study-download-request.model';
import { StudyDownloadService } from '../services/study-download-request.service';

@Injectable()
export class StudyDownloadRequestPipe implements PipeTransform<string, Promise<StudyDownloadRequest>> {
  constructor(private readonly downloadService: StudyDownloadService) {}

  async transform(value: string): Promise<StudyDownloadRequest> {
    const downloadRequest = await this.downloadService.find(value);
    if (!downloadRequest) {
      throw new BadRequestException(`Study down with the id ${value} not found`);
    }
    return downloadRequest;
  }
}
