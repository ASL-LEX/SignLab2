import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserOrg, UserOrgDocument } from './userorg.model';

@Injectable()
export class UserOrgService {
  constructor(@InjectModel(UserOrg.name) private userOrgModel: Model<UserOrgDocument>) {}

  async create(user: string, org: string): Promise<UserOrg> {
    const existing = await this.find(user, org);
    if (existing) {
      return existing;
    }
    return this.userOrgModel.create({ user, org });
  }

  async findUserForOrg(org: string): Promise<UserOrg[]> {
    return this.userOrgModel.find({ org });
  }

  async userIsInOrg(user: string, org: string): Promise<boolean> {
    return !!(await this.find(user, org));
  }

  async find(user: string, org: string): Promise<UserOrg | null> {
    return this.userOrgModel.findOne({ user, org });
  }
}
