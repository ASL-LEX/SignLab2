import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Dataset } from './dataset.model';
import { DatasetService } from './dataset.service';
import { Organization } from '../organization/organization.model';
import { OrganizationContext } from '../organization/organization.context';
import { DatasetCreate } from './dtos/create.dto';
import { DatasetPipe } from './pipes/dataset.pipe';
import { BadRequestException, UseGuards, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { CASBIN_PROVIDER } from '../permission/casbin.provider';
import * as casbin from 'casbin';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';
import { DatasetPermissions } from '../permission/permissions/dataset';
import { ProjectPipe } from '../project/pipes/project.pipe';
import { Project } from '../project/project.model';
import { ProjectPermissions } from '../permission/permissions/project';

// TODO: Add authentication
@UseGuards(JwtAuthGuard)
@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(
    private readonly datasetService: DatasetService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  @Query(() => [Dataset])
  async getDatasets(@OrganizationContext() organization: Organization): Promise<Dataset[]> {
    // TODO: Get datasets based on access permissions

    return this.datasetService.findAll(organization._id);
  }

  @Query(() => Boolean)
  async datasetExists(
    @Args('name') name: string,
    @OrganizationContext() organization: Organization,
    @TokenContext() user: TokenPayload
  ): Promise<boolean> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.READ, organization._id))) {
      throw new UnauthorizedException('User does not have permission to read a dataset in this organization');
    }
    return this.datasetService.exists(name, organization._id);
  }

  @Mutation(() => Dataset)
  async createDataset(
    @Args('dataset') dataset: DatasetCreate,
    @OrganizationContext() organization: Organization,
    @TokenContext() user: TokenPayload
  ): Promise<Dataset> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.CREATE, organization._id))) {
      throw new UnauthorizedException('User does not have permission to create a dataset in this organization');
    }

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
    @OrganizationContext() organization: Organization
  ): Promise<boolean> {
    if (!(await this.enforcer.enforce(organization._id, DatasetPermissions.UPDATE, dataset._id))) {
      throw new UnauthorizedException('User does not have permission to update this dataset');
    }

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
    @Args('newDescription') newDescription: string
  ): Promise<boolean> {
    if (!(await this.enforcer.enforce(dataset._id, DatasetPermissions.UPDATE, dataset._id))) {
      throw new UnauthorizedException('User does not have permission to update this dataset');
    }

    await this.datasetService.changeDescription(dataset, newDescription);

    return true;
  }

  @Query(() => [Dataset])
  async getDatasetsByProject(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @TokenContext() user: TokenPayload
  ): Promise<Dataset[]> {
    // Make sure the user has access to the project
    if (!(await this.enforcer.enforce(user.id, ProjectPermissions.READ, project._id))) {
      throw new UnauthorizedException('User does not have permission to read this project');
    }

    return this.datasetService.findByProject(project);
  }
}
