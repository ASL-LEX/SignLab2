import { Injectable, UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { UploadSession } from '../models/upload-session.model';
import { UploadSessionService } from '../services/upload-session.service';
import { Dataset } from '../../dataset/dataset.model';
import { Args, ID, Mutation, Query } from '@nestjs/graphql';
import { UploadSessionPipe } from '../pipes/upload-session.pipe';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { UploadResult } from '../dtos/upload-result.dto';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { DatasetPermissions } from '../../auth/permissions/dataset';
import { CASBIN_PROVIDER } from '../../auth/casbin.provider';
import * as casbin from 'casbin';
import { UserContext } from 'src/auth/user.decorator';
import { TokenPayload } from 'src/auth/user.dto';

@UseGuards(JwtAuthGuard)
@Injectable()
export class UploadSessionResolver {
  constructor(
    private readonly uploadSessionService: UploadSessionService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  // TODO: Grab the user from the request
  @Mutation(() => UploadSession)
  async createUploadSession(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @UserContext() user: TokenPayload
  ): Promise<UploadSession> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.UPDATE, dataset._id))) {
      throw new UnauthorizedException('User cannot write entries on this dataset');
    }

    return this.uploadSessionService.create(dataset);
  }

  // TODO: Add return for any cleanup
  @Mutation(() => UploadResult)
  async completeUploadSession(
    @Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession,
    @UserContext() user: TokenPayload
  ): Promise<UploadResult> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.UPDATE, uploadSession.dataset))) {
      throw new UnauthorizedException('User cannot write entries on this dataset');
    }

    return this.uploadSessionService.complete(uploadSession);
  }

  @Query(() => String, { description: 'Get the presigned URL for where to upload the CSV against' })
  async getCSVUploadURL(
    @Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession,
    @UserContext() user: TokenPayload
  ): Promise<string> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.UPDATE, uploadSession.dataset))) {
      throw new UnauthorizedException('User cannot write entries on this dataset');
    }

    return this.uploadSessionService.getCSVUploadURL(uploadSession);
  }

  @Query(() => UploadResult)
  async validateCSV(
    @Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession,
    @UserContext() user: TokenPayload
  ): Promise<UploadResult> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.UPDATE, uploadSession.dataset))) {
      throw new UnauthorizedException('User cannot write entries on this dataset');
    }

    return await this.uploadSessionService.validateCSV(uploadSession);
  }

  // TODO: Implement caching for the upload session since it's used a lot
  @Query(() => String)
  async getEntryUploadURL(
    @Args('session', { type: () => ID }, UploadSessionPipe) uploadSession: UploadSession,
    @Args('filename') filename: string,
    @Args('contentType') contentType: string,
    @UserContext() user: TokenPayload
  ): Promise<string> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.UPDATE, uploadSession.dataset))) {
      throw new UnauthorizedException('User cannot write entries on this dataset');
    }

    return this.uploadSessionService.getEntryUploadURL(uploadSession, filename, contentType);
  }
}
