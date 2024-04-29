import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';
import { DatasetDownloadService } from '../services/dataset-download-request.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { OrganizationContext } from 'src/organization/organization.context';
import { Organization } from '../../organization/organization.model';
import { OrganizationGuard } from '../../organization/organization.guard';
import { CreateDatasetDownloadPipe } from '../pipes/dataset-download-request-create.pipe';
import { Dataset } from '../../dataset/dataset.model';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';


@UseGuards(JwtAuthGuard, OrganizationGuard)
@Resolver(() => DatasetDownloadRequest)
export class DatasetDownloadRequestResolver {

  constructor(private readonly datasetDownloadService: DatasetDownloadService) {}

  @Mutation(() => DatasetDownloadRequest)
  async createDatasetDownload(
    @Args('downloadRequest', CreateDatasetDownloadPipe) downloadRequest: CreateDatasetDownloadRequest,
    @OrganizationContext() organization: Organization
  ): Promise<DatasetDownloadRequest> {
    return this.datasetDownloadService.createDownloadRequest(downloadRequest, organization);
  }

  @Query(() => [DatasetDownloadRequest])
  async getDatasetDownloads(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset
  ): Promise<DatasetDownloadRequest[]> {
    return this.datasetDownloadService.getDatasetDownloadRequests(dataset);
  }
}
