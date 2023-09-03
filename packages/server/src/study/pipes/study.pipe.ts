import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { StudyService } from '../study.service';
import { Study } from '../study.model';

@Injectable()
export class StudyPipe implements PipeTransform<string, Promise<Study>> {
  constructor(private readonly studyService: StudyService) {}

  async transform(value: string): Promise<Study> {
    const study = await this.studyService.findById(value);
    if (!study) {
      throw new BadRequestException(`Study with ID ${value} does not exist`);
    }
    return study;
  }
}

