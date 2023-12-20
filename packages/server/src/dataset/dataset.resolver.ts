import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Dataset } from './dataset.model';
import { DatasetService } from './dataset.service';
import { Organization } from '../organization/organization.model';
import { OrganizationContext } from '../organization/organization.context';
import { DatasetCreate } from './dtos/create.dto';
import { DatasetPipe } from './pipes/dataset.pipe';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

// TODO: Add authentication
@UseGuards(JwtAuthGuard)
@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(private readonly datasetService: DatasetService) {}

  @Query(() => [Dataset])
  async getDatasets(@OrganizationContext() organization: Organization): Promise<Dataset[]> {
    return this.datasetService.findAll(organization._id);
  }

  @Mutation(() => Dataset)
  async createDataset(@Args('dataset') dataset: DatasetCreate,
                      @OrganizationContext() organization: Organization): Promise<Dataset> {
    const existingDataset = await this.datasetService.findByName(organization._id, dataset.name);
    if (existingDataset) {
      throw new BadRequestException(`Dataset with the name ${dataset.name} already exists`);
    }

    return this.datasetService.create(organization._id, dataset);
  }

  @Mutation(() => Boolean)
  async changeDatasetName(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @Args('newName') newName: string,
    @OrganizationContext() organization: Organization): Promise<boolean> {

    const existingDataset = await this.datasetService.findByName(organization._id, newName);
    if (existingDataset) {
      throw new BadRequestException(`Dataset with the name ${newName} already exists`);
    }

    await this.datasetService.changeName(dataset, newName);

    return true;
  }

  @Mutation(() => Boolean)
  async changeDatasetDescription(
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @Args('newDescription') newDescription: string): Promise<boolean> {

    await this.datasetService.changeDescription(dataset, newDescription);

    return true;
  }
}
