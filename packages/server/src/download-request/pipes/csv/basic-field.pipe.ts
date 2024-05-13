import { PipeTransform, Injectable } from '@nestjs/common';
import { CsvFieldTest } from '../../types/csv-field';

/**
 * Handles "transforming" CSV fields where the data itself is already
 * able to be represented as a string
 */
@Injectable()
export class BasicCsvTransformer implements PipeTransform<any, Promise<string>> {
  async transform(value: any): Promise<string> {
    return value ? value.toString() : '';
  }
}

export const basicCsvTest: CsvFieldTest = (_uischema, _schema) => {
  return true;
};
