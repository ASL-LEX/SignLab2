import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Dataset } from '../dataset.model';
import { DatasetService } from '../dataset.service';

@Injectable()
export class DatasetPipe implements PipeTransform<string, Promise<Dataset>> {
  constructor(private readonly datasetService: DatasetService) {}

  async transform(value: string): Promise<Dataset> {
    const dataset = await this.datasetService.findById(value);
    if (!dataset) {
      throw new BadRequestException(`Dataset with ID ${value} does not exist`);
    }
    return dataset;
  }
}
