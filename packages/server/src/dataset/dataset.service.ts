import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dataset } from './dataset.model';
import { DatasetCreate } from './dtos/create.dto';
import { ConfigService } from '@nestjs/config';
import { CASBIN_PROVIDER } from '../permission/casbin.provider';
import * as casbin from 'casbin';
import { Project } from '../project/project.model';

@Injectable()
export class DatasetService {
  private readonly datasetPrefix = this.configService.getOrThrow<string>('dataset.prefix');

  constructor(
    @InjectModel(Dataset.name) private readonly datasetModel: Model<Dataset>,
    private readonly configService: ConfigService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  async findById(id: string): Promise<Dataset | null> {
    return this.datasetModel.findById(id);
  }

  async findAll(organization: string): Promise<Dataset[]> {
    return this.datasetModel.find({ organization });
  }

  async findByName(organization: string, name: string): Promise<Dataset | null> {
    return this.datasetModel.findOne({ organization, name });
  }

  async exists(name: string, organization: string): Promise<boolean> {
    const dataset = await this.datasetModel.findOne({ name, organization });
    return !!dataset;
  }

  async existsById(id: string): Promise<boolean> {
    const dataset = await this.datasetModel.findOne({ _id: id });
    return !!dataset;
  }

  async create(organization: string, datasetCreate: DatasetCreate): Promise<Dataset> {
    // Create the dataset
    const dataset = await this.datasetModel.create({ ...datasetCreate, organization });

    // Add in the bucket prefix for the dataset
    dataset.bucketPrefix = `${this.datasetPrefix}/${organization}/${dataset._id}`;
    await dataset.save();

    // Add organization - dataset mapping to casbin
    await this.enforcer.addNamedGroupingPolicy('g2', organization, dataset._id.toString());

    // Return the created dataset
    return dataset;
  }

  async changeName(dataset: Dataset, newName: string): Promise<void> {
    await this.datasetModel.updateOne({ _id: dataset._id }, { $set: { name: newName } });
  }

  async changeDescription(dataset: Dataset, newDescription: string): Promise<void> {
    await this.datasetModel.updateOne({ _id: dataset._id }, { $set: { description: newDescription } });
  }

  /** Get datasets a given project has access to */
  async findByProject(project: Project): Promise<Dataset[]> {
    const datasets = await this.datasetModel.find({ organization: project.organization });
    const filteredDatasets: Dataset[] = [];
    for (const dataset of datasets) {
      if (await this.enforcer.hasNamedGroupingPolicy('g2', project._id.toString(), dataset._id.toString())) {
        filteredDatasets.push(dataset);
      }
    }

    return filteredDatasets;
  }
}
