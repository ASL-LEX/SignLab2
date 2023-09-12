import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {Tag} from '../tag.model';
import { TagService } from '../tag.service';

@Injectable()
export class TagPipe implements PipeTransform<string, Promise<Tag>> {
  constructor(private readonly tagService: TagService) {}

  async transform(value: string): Promise<Tag> {
    const result = await this.tagService.find(value);
    if (!result) {
      throw new BadRequestException(`Tag with ID ${value} does not exist`);
    }
    return result;
  }
}
