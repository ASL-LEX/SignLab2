import { Injectable } from '@nestjs/common';
import { UploadSession } from '../models/upload-session.model';
import { UploadSessionService } from '../services/upload-session.service';
import { Dataset } from '../../dataset/dataset.model';
import { Args, ID, Mutation, Query } from '@nestjs/graphql';
import { UploadSessionPipe } from '../pipes/upload-session.pipe';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { UploadResult } from '../dtos/upload-result.dto';

@Injectable()
export class UploadSessionResolver {
  constructor(private readonly uploadSessionService: UploadSessionService) {}

  // TODO: Grab the user from the request
  @Mutation(() => UploadSession)
  async createUploadSession(@Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset): Promise<UploadSession> {
    return this.uploadSessionService.create(dataset);
  }

  // TODO: Add return for any cleanup
  @Mutation(() => UploadResult)
  async completeUploadSession(@Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession): Promise<UploadResult> {
    return this.uploadSessionService.complete(uploadSession);
  }

  @Query(() => String, { description: 'Get the presigned URL for where to upload the CSV against' })
  async getCSVUploadURL(@Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession): Promise<string> {
    return this.uploadSessionService.getCSVUploadURL(uploadSession);
  }

  @Query(() => UploadResult)
  async validateCSV(@Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession): Promise<UploadResult> {
    return await this.uploadSessionService.validateCSV(uploadSession);
  }

  // TODO: Implement caching for the upload session since it's used a lot
  @Query(() => String)
  async getEntryUploadURL(@Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession,
                          @Args('filename') filename: string,
                          @Args('contentType') contentType: string): Promise<string> {
    return this.uploadSessionService.getEntryUploadURL(uploadSession, filename, contentType);
  }
}
