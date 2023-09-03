import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dataset } from './dataset.model';
import { DatasetCreate } from './dtos/create.dto';


@Injectable()
export class DatasetService {
  constructor(@InjectModel(Dataset.name) private readonly datasetModel: Model<Dataset>) {}

  async findById(id: string): Promise<Dataset | null> {
    return this.datasetModel.findById(id);
  }

  async findAll(organization: string): Promise<Dataset[]> {
    return this.datasetModel.find({ organization });
  }

  async findByName(organization: string, name: string): Promise<Dataset | null> {
    return this.datasetModel.findOne({ organization, name });
  }

  async create(organization: string, datasetCreate: DatasetCreate): Promise<Dataset> {
    return this.datasetModel.create({ ...datasetCreate, organization });
  }

  async changeName(dataset: Dataset, newName: string): Promise<void> {
    await this.datasetModel.updateOne({ _id: dataset._id }, { $set: { name: newName } });
  }

  async changeDescription(dataset: Dataset, newDescription: string): Promise<void> {
    await this.datasetModel.updateOne({ _id: dataset._id }, { $set: { description: newDescription } });
  }
}
