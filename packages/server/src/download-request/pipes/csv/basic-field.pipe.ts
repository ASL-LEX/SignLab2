import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * Handles "transforming" CSV fields where the data itself is already
 * able to be represented as a string
 */
@Injectable()
export class BasicCsvTransformer implements PipeTransform<any, Promise<string>> {
  async transform(value: any): Promise<string> {
    return value.toString();
  }
}
