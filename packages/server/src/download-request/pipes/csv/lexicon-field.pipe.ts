import { Injectable, PipeTransform } from '@nestjs/common';
import { CsvFieldTest } from '../../../download-request/types/csv-field';

@Injectable()
export class LexiconCsvTransformer implements PipeTransform<any, Promise<string>> {
  async transform(value: any): Promise<string> {
    if (!value) {
      return '';
    }

    return value.key;
  }
}

export const lexiconCsvTest: CsvFieldTest = (uischema, _schema) => {
  if (uischema.options?.customType === 'asl-lex') {
    return true;
  }
  return false;
};
