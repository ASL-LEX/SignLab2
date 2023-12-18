import { Injectable } from '@nestjs/common';
import { Dataset } from '../../dataset/dataset.model';
import { Readable } from 'stream';
import { EntryUpload } from '../models/entry-upload.model';
import { UploadSession } from '../models/upload-session.model';
import { EntryService } from '../services/entry.service';

const csv = require('csv-parser');

export interface CsvValidationResult {
  success: boolean;
  message?: string;
  entryUploads?: EntryUpload[];
}

/**
 * Handles the process of going through a CSV and validating each field
 */
@Injectable()
export class CsvValidationService {
  private static REQUIRED_CSV_HEADERS = [
    'entryID',
    'filename'
  ];

  constructor(private readonly entryService: EntryService) {}

  // TODO: Add validation result type
  async validate(csvBuffer: Buffer, dataset: Dataset, uploadSession: UploadSession): Promise<CsvValidationResult> {
    const parser = Readable.from(csvBuffer).pipe(csv({ strict: true }));

    // Validate the headers of the CSV are valid
    const headers = await this.parseHeaders(parser);
    const headerValidationResult = this.validateHeaders(headers, dataset);
    if (!headerValidationResult.success) {
      return headerValidationResult;
    }

    // Go row by row, extracting the information, and validating the data
    const entryUploads: EntryUpload[] = [];
    const newEntryIDs: Set<string> = new Set();

    let lineNumber = 2; // Ignore the header line
    for await (const row of parser) {
      const { data, errorMessage } = this.toEntryUpload(row, dataset, uploadSession);

      // If the row is invalid, return the error message
      if (errorMessage) {
        return { success: false, message: `Error on line ${lineNumber}: ${errorMessage}` };
      }

      // Make sure the entryID is unique for the given dataset
      if (newEntryIDs.has(data!.entryID) || (await this.entryService.exists(data!.entryID, dataset))) {
        return { success: false, message: `Error on line ${lineNumber}: entryID must be unique` };
      }

      // Otherwise, add the entry to the list of entries
      entryUploads.push(data!);
      newEntryIDs.add(data!.entryID);

      lineNumber++;
    }

    // No entries other then the header present, return an error
    if (lineNumber == 2) {
      return { success: false, message: 'No entries present in CSV' };
    }

    return { success: true, entryUploads };
  }

  // TODO: Address type issue with the CSV parser
  private async parseHeaders(parser: any): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      parser.on('headers', (headers: string[]) => {
        resolve(headers);
      });
      parser.on('error', (err: Error) => {
        reject(err);
      });
    });
  }

  /** Ensure the required headers are present **/
  private validateHeaders(headers: string[], _dataset: Dataset): CsvValidationResult {
    // Check that the required headers are present
    for (const requiredHeader of CsvValidationService.REQUIRED_CSV_HEADERS) {
      if (!headers.includes(requiredHeader)) {
        return { success: false, message: `Missing required header: ${requiredHeader}` };
      }
    }

    // TODO: Check that the additional headers are present that are
    // required for the dataset
    return { success: true };
  }

  /** Helper to convert the CSV lines to an array of objects */
  private toEntryUpload(row: any, _dataset: Dataset, session: UploadSession): { data?: EntryUpload, errorMessage?: string } {
    const entryID = row.entryID;
    const filename = row.filename;

    delete row.entryID;
    delete row.filename;

    // TODO: Validate the row metadata against the dataset
    const metadata = row;

    return {
      data: {
        session: session._id,
        entryID,
        filename,
        metadata,
      }
    };
  }
}
