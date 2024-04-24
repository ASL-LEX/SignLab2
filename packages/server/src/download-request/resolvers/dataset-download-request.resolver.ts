import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateDatasetDownloadRequest } from '../dtos/dataset-download-request-create.dto';
import { DatasetDownloadRequest } from '../models/dataset-download-request.model';
import { DatasetDownloadService } from '../services/dataset-download-request.service';

@Resolver(() => DatasetDownloadRequest)
export class DatasetDownloadRequestResolver {

  constructor(private readonly datasetDownloadService: DatasetDownloadService) {}

  @Mutation(() => DatasetDownloadRequest)
  async createDatasetDownload(@Args('downloadRequest') downloadRequest: CreateDatasetDownloadRequest): Promise<DatasetDownloadRequest> {
    return this.datasetDownloadService.createDownloadRequest(downloadRequest);
  }
}
