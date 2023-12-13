import { Injectable, Inject } from '@nestjs/common';
import { UploadSession } from '../models/upload-session.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dataset } from '../../dataset/dataset.model';
import { GCP_STORAGE_PROVIDER } from '../../gcp/providers/storage.provider';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadSessionService {
  private readonly uploadBucket = this.configService.getOrThrow<string>('gcp.storage.bucket');
  private readonly uploadPrefix = this.configService.getOrThrow<string>('upload.prefix');
  private readonly csvFileName = this.configService.getOrThrow<string>('upload.csvFileName');

  constructor(@InjectModel(UploadSession.name) private readonly uploadSessionModel: Model<UploadSession>,
              @Inject(GCP_STORAGE_PROVIDER) private readonly storage: Storage,
              private readonly configService: ConfigService) {}

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
    uploadSession.bucketPrefix = `/upload-session/${uploadSession._id}`;

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

    const [url] = await this.storage
      .bucket(this.uploadBucket)
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

  // TODO: Provide user information
  private async deleteOldSession(dataset: Dataset): Promise<void> {
    await this.uploadSessionModel.deleteMany({ dataset: dataset._id }).exec();
  }
}
