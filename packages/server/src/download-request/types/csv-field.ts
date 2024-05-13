import { PipeTransform } from '@nestjs/common';

/**
 * Represents a column within a CSV. Keep track both of the header as well as how
 * to get the field value from an object.
 */
export interface CsvField {
  header: string;
  convertField: PipeTransform<any, Promise<string>>;
}
