import { Injectable } from '@nestjs/common';
import { Dataset } from '../../dataset/dataset.model';
import { Readable } from 'stream';

const csv = require('csv-parser');

/**
 * Handles the process of going through a CSV and validating each field
 */
@Injectable()
export class CsvValidationService {
  constructor() {}

  // TODO: Add validation result type
  async validate(csvBuffer: Buffer, dataset: Dataset): Promise<boolean> {
    const parser = Readable.from(csvBuffer).pipe(csv({ strict: true }));
    for await (const row of parser) {
      console.log(row);
    }

    return true;
  }

  /** Helper to convert the CSV lines to an array of objects */
  private csvToJSON(csv: Buffer): any[] {

    return [];
  }
}
