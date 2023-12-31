import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UploadSession } from '../models/upload-session.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dataset } from '../../dataset/dataset.model';
import { GCP_STORAGE_PROVIDER } from '../../gcp/providers/storage.provider';
import { Bucket, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { CsvValidationService } from './csv-validation.service';
import { DatasetService } from '../../dataset/dataset.service';
import { EntryUploadService } from '../services/entry-upload.service';
import { UploadStatus, UploadResult } from '../dtos/upload-result.dto';
import { EntryService } from './entry.service';
import { TokenPayload } from '../../jwt/token.dto';

@Injectable()
export class UploadSessionService {
  private readonly uploadBucket = this.configService.getOrThrow<string>('gcp.storage.bucket');
  private readonly uploadPrefix = this.configService.getOrThrow<string>('upload.prefix');
  private readonly csvFileName = this.configService.getOrThrow<string>('upload.csvFileName');
  private readonly entryFolder = this.configService.getOrThrow<string>('upload.entryFolder');
  private readonly bucket: Bucket = this.storage.bucket(this.uploadBucket);

  constructor(
    @InjectModel(UploadSession.name) private readonly uploadSessionModel: Model<UploadSession>,
    @Inject(GCP_STORAGE_PROVIDER) private readonly storage: Storage,
    private readonly configService: ConfigService,
    private readonly csvValidation: CsvValidationService,
    private readonly datasetService: DatasetService,
    private readonly entryUploadService: EntryUploadService,
    private readonly entryService: EntryService
  ) {}

  async find(id: string): Promise<UploadSession | null> {
    return this.uploadSessionModel.findById(id).exec();
  }

  async create(dataset: Dataset): Promise<UploadSession> {
    await this.deleteOldSession(dataset);

    // Make the session
    const uploadSession = await this.uploadSessionModel.create({
      dataset: dataset._id,
      created: new Date()
    });

    // Add in the bucket prefix for the session
    uploadSession.bucketPrefix = `${uploadSession._id}`;

    // Save the session
    await uploadSession.save();

    return uploadSession;
  }

  async complete(uploadSession: UploadSession, user: TokenPayload): Promise<UploadResult> {
    // Verify the CSV is in the bucket
    if (!uploadSession.csvURL) {
      throw new BadRequestException('CSV URL not found');
    }

    // Get the dataset
    const dataset = await this.datasetService.findById(uploadSession.dataset);
    if (!dataset) {
      return { status: UploadStatus.ERROR, message: 'Dataset not found' };
    }

    // Get all the entry uploads
    const entryUploads = await this.entryUploadService.findForSession(uploadSession);
    if (entryUploads.length == 0) {
      throw new BadRequestException('No entries found');
    }

    const missingEntries: string[] = [];

    // Go over each entry and move it to the dataset
    for (const entryUpload of entryUploads) {
      const entryURL = `${uploadSession.entryPrefix}/${entryUpload.filename}`;

      const entryFile = this.bucket.file(entryURL);

      // Verify the entry is in the bucket
      const exists = await entryFile.exists();
      if (!exists[0]) {
        missingEntries.push(`Entry ${entryUpload.filename} not found`);
        continue;
      }

      // Create the entry object
      const entry = await this.entryService.create(
        {
          entryID: entryUpload.entryID,
          contentType: entryFile.metadata.contentType,
          meta: entryUpload.metadata
        },
        dataset,
        user
      );

      // Move the entry to the dataset
      const fileExtension = entryUpload.filename.split('.').pop();
      const filename = `${entry._id}.${fileExtension}`;
      const newName = `${dataset.bucketPrefix}/${filename}`;
      await entryFile.move(newName);

      // Add the bucket URL to the entry
      await this.entryService.setBucketLocation(entry, newName);
    }

    // Now remove the upload session
    await this.deleteOldSession(dataset);

    // Let users know if there were missing entries
    // TODO: Add concept of status to messages
    if (missingEntries.length > 0) {
      return {
        status: UploadStatus.WARNING,
        message: `The following entries where in the CSV, but not uploaded:\n ${missingEntries.join(', ')}`
      };
    }

    // No issues
    return { status: UploadStatus.SUCCESS };
  }

  /** Generate the presigned URL for where to upload the CSV against */
  async getCSVUploadURL(uploadSession: UploadSession): Promise<string> {
    const csvURL = `${this.uploadPrefix}/${uploadSession.bucketPrefix}/${this.csvFileName}`;
    const entryPrefix = `${this.uploadPrefix}/${uploadSession.bucketPrefix}/${this.entryFolder}`;

    const [url] = await this.bucket.file(csvURL).getSignedUrl({
      action: 'write',
      expires: Date.now() + 2 * 60 * 1000, // 2 minutes
      contentType: 'text/csv'
    });

    // Add the url to the upload session to signify the upload is ready
    await this.uploadSessionModel.updateOne({ _id: uploadSession._id }, { $set: { csvURL, entryPrefix } });

    return url;
  }

  async getEntryUploadURL(uploadSession: UploadSession, filename: string, filetype: string): Promise<string> {
    if (!uploadSession.entryPrefix) {
      throw new BadRequestException('CSV must be uploaded before entries');
    }

    const entryURL = `${uploadSession.entryPrefix}/${filename}`;

    const [url] = await this.bucket.file(entryURL).getSignedUrl({
      action: 'write',
      expires: Date.now() + 2 * 60 * 1000, // 2 minutes
      contentType: filetype
    });

    return url;
  }

  async validateCSV(uploadSession: UploadSession): Promise<UploadResult> {
    // Verify the CSV is in the bucket
    if (!uploadSession.csvURL) {
      throw new BadRequestException('CSV URL not found');
    }
    const exists = await this.bucket.file(uploadSession.csvURL).exists();
    if (!exists) {
      throw new BadRequestException('CSV not found');
    }

    // Download the CSV to /tmp location
    const csvFile = this.bucket.file(uploadSession.csvURL);
    const csvFileContents = await csvFile.download();

    // Get the cooresponding dataset
    const dataset = await this.datasetService.findById(uploadSession.dataset);
    if (!dataset) {
      return { status: UploadStatus.ERROR, message: 'Dataset not found' };
    }

    // Validate the CSV contents against the target dataset
    const csvValidationResults = await this.csvValidation.validate(csvFileContents[0], dataset, uploadSession);

    if (!csvValidationResults.success) {
      // TODO: Add object type return here
      return { status: UploadStatus.ERROR, message: csvValidationResults.message };
    }

    // Otherwise store the validated results for the next step
    await Promise.all(
      csvValidationResults.entryUploads!.map((entryUpload) => this.entryUploadService.create(entryUpload))
    );

    // Return the validation status
    return { status: UploadStatus.SUCCESS };
  }

  // TODO: Provide user information
  private async deleteOldSession(dataset: Dataset): Promise<void> {
    const existing = await this.uploadSessionModel.findOne({ dataset: dataset._id }).exec();
    if (existing) {
      // Delete the in progress entry uploads
      await this.entryUploadService.deleteForSession(existing);
      // Remove cooresponding upload files
      await this.bucket.deleteFiles({ prefix: `${this.uploadPrefix}/${existing.bucketPrefix}` });
      // Remove the upload session itself
      await this.uploadSessionModel.deleteOne({ _id: existing._id }).exec();
    }
  }
}
