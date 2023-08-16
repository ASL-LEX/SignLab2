import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationDocument } from './organization.model';
import { Model } from 'mongoose';
import { OrganizationCreate } from './dtos/create.dto';

@Injectable()
export class OrganizationService {
  constructor(@InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>) {}

  async find(): Promise<Organization[]> {
    return this.orgModel.find();
  }

  async findOne(id: string): Promise<Organization | null> {
    return this.orgModel.findById(id);
  }

  async create(orgCreate: OrganizationCreate): Promise<Organization> {
    return this.orgModel.create(orgCreate);
  }

  async findByName(name: string): Promise<Organization | null> {
    return this.orgModel.findOne({ name });
  }
}
