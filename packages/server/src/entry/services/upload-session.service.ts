import { Injectable, Inject } from '@nestjs/common';
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
import { UploadResult } from '../dtos/upload-result.dto';

@Injectable()
export class UploadSessionService {
  private readonly uploadBucket = this.configService.getOrThrow<string>('gcp.storage.bucket');
  private readonly uploadPrefix = this.configService.getOrThrow<string>('upload.prefix');
  private readonly csvFileName = this.configService.getOrThrow<string>('upload.csvFileName');
  private readonly bucket: Bucket = this.storage.bucket(this.uploadBucket);

  constructor(@InjectModel(UploadSession.name) private readonly uploadSessionModel: Model<UploadSession>,
              @Inject(GCP_STORAGE_PROVIDER) private readonly storage: Storage,
              private readonly configService: ConfigService,
              private readonly csvValidation: CsvValidationService,
              private readonly datasetService: DatasetService,
              private readonly entryUploadService: EntryUploadService) {}

  async find(id: string): Promise<UploadSession | null> {
    return this.uploadSessionModel.findById(id).exec();
  }

  async create(dataset: Dataset): Promise<UploadSession> {
    await this.deleteOldSession(dataset);

    // Make the session
    const uploadSession = await this.uploadSessionModel.create({
      dataset: dataset._id,
      created: new Date(),
    });

    // Add in the bucket prefix for the session
    uploadSession.bucketPrefix = `${uploadSession._id}`;

    // Save the session
    await uploadSession.save();

    return uploadSession;
  }

  async complete(uploadSession: UploadSession): Promise<void> {
    // TODO: Implement completion logic
  }

  /** Generate the presigned URL for where to upload the CSV against */
  async getCSVUploadURL(uploadSession: UploadSession): Promise<string> {
    const csvURL = `${this.uploadPrefix}/${uploadSession.bucketPrefix}/${this.csvFileName}`;

    const [url] = await this.bucket
      .file(csvURL)
      .getSignedUrl({
        action: 'write',
        expires: Date.now() + 2 * 60 * 1000, // 2 minutes
        contentType: 'text/csv',
      });

    // Add the url to the upload session to signify the upload is ready
    await this.uploadSessionModel.updateOne({ _id: uploadSession._id }, { $set: { csvURL } });

    return url;
  }

  // TODO: Have the function return a status
  async validateCSV(uploadSession: UploadSession): Promise<UploadResult> {
    // Verify the CSV is in the bucket
    if (!uploadSession.csvURL) {
      throw new Error('CSV URL not found');
    }
    const exists = await this.bucket.file(uploadSession.csvURL).exists();
    if (!exists) {
      throw new Error('CSV not found');
    }

    // Download the CSV to /tmp location
    const csvFile = this.bucket.file(uploadSession.csvURL);
    const csvFileContents = await csvFile.download();

    // Get the cooresponding dataset
    const dataset = await this.datasetService.findById(uploadSession.dataset);
    if (!dataset) {
      return { success: false, message: 'Dataset not found' };
    }

    // Validate the CSV contents against the target dataset
    const csvValidationResults = await this.csvValidation.validate(csvFileContents[0], dataset, uploadSession);

    if (!csvValidationResults.success) {
      // TODO: Add object type return here
      return { success: false, message: csvValidationResults.message };
    }

    // Otherwise store the validated results for the next step
    await Promise.all(csvValidationResults.entryUploads!.map(entryUpload => this.entryUploadService.create(entryUpload)));

    // Return the validation status
    return { success: true };
  }

  // TODO: Provide user information
  private async deleteOldSession(dataset: Dataset): Promise<void> {
    await this.uploadSessionModel.deleteMany({ dataset: dataset._id }).exec();
  }
}
