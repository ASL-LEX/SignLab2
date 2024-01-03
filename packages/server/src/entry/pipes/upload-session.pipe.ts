import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UploadSession } from '../models/upload-session.model';
import { UploadSessionService } from '../services/upload-session.service';

@Injectable()
export class UploadSessionPipe implements PipeTransform<string, Promise<UploadSession>> {
  constructor(private readonly uploadSessionService: UploadSessionService) {}

  async transform(value: string): Promise<UploadSession> {
    const result = await this.uploadSessionService.find(value);

    if (!result) {
      throw new BadRequestException('Invalid upload session');
    }
    return result;
  }
}
