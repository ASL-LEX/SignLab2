import { Resolver, Mutation, Args, Query, ID, ResolveField, Parent } from '@nestjs/graphql';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';
import { DatasetDownloadRequest, DatasetDownloadField } from '../models/dataset-download-request.model';
import { DatasetDownloadService } from '../services/dataset-download-request.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { OrganizationContext } from 'src/organization/organization.context';
import { Organization } from '../../organization/organization.model';
import { OrganizationGuard } from '../../organization/organization.guard';
import { CreateDatasetDownloadPipe } from '../pipes/dataset-download-request-create.pipe';
import { Dataset } from '../../dataset/dataset.model';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { DatasetDownloadRequestPipe } from '../pipes/dataset-download-request.pipe';

@Resolver(() => DatasetDownloadRequest)
export class DatasetDownloadRequestResolver {
  constructor(
    private readonly datasetDownloadService: DatasetDownloadService,
    private readonly datasetPipe: DatasetPipe
  ) {}

  @Mutation(() => DatasetDownloadRequest)
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  async createDatasetDownload(
    @Args('downloadRequest', CreateDatasetDownloadPipe) downloadRequest: CreateDatasetDownloadRequest,
    @OrganizationContext() organization: Organization
  ): Promise<DatasetDownloadRequest> {
    return this.datasetDownloadService.createDownloadRequest(downloadRequest, organization);
  }

  @Query(() => [DatasetDownloadRequest])
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  async getDatasetDownloads(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset
  ): Promise<DatasetDownloadRequest[]> {
    return this.datasetDownloadService.getDatasetDownloadRequests(dataset);
  }

  @Mutation(() => Boolean)
  async markDatasetFieldComplete(
    @Args('downloadRequest', { type: () => ID }, DatasetDownloadRequestPipe) downloadRequest: DatasetDownloadRequest,
    @Args('datasetField', { type: () => DatasetDownloadField }) datasetField: DatasetDownloadField,
    @Args('code') verificationCode: string
  ): Promise<boolean> {
    if (verificationCode !== downloadRequest.verificationCode) {
      throw new UnauthorizedException(`Invalid verification code`);
    }

    await this.datasetDownloadService.markFieldComplete(downloadRequest, datasetField);
    return true;
  }

  @ResolveField(() => String)
  async entryZip(@Parent() downloadRequest: DatasetDownloadRequest): Promise<string> {
    return this.datasetDownloadService.getEntryZipURL(downloadRequest);
  }

  @ResolveField(() => Dataset)
  async dataset(@Parent() downloadRequest: DatasetDownloadRequest): Promise<Dataset> {
    return this.datasetPipe.transform(downloadRequest.dataset);
  }
}
