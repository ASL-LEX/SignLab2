import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.model';
import { ProjectCreate } from './dtos/create.dto';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(project: ProjectCreate, organization: string): Promise<Project> {
    return this.projectModel.create({
      ...project,
      organization,
      created: new Date()
    });
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel.findById(id);
  }

  async exists(name: string, organization: string): Promise<boolean> {
    const project = await this.projectModel.findOne({ name, organization });
    return !!project;
  }

  async findAll(organization: string): Promise<Project[]> {
    return this.projectModel.find({ organization }).exec();
  }

  async delete(project: Project): Promise<void> {
    await this.projectModel.deleteOne({ _id: project._id });
  }
}
