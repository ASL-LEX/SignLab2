import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Study } from './study.model';
import { StudyCreate } from './dtos/create.dto';
import { Validator } from 'jsonschema';
import { Project } from 'src/project/project.model';
import { MongooseMiddlewareService } from 'src/shared/service/mongoose-callback.service';

@Injectable()
export class StudyService {
  constructor(@InjectModel(Study.name) private readonly studyModel: Model<Study>, middlewareService: MongooseMiddlewareService) {
    // Remove cooresponding studies when a project is deleted
    middlewareService.register(Project.name, 'deleteOne', async (project: Project) => {
      await this.removeForProject(project);
    });
  }

  async create(study: StudyCreate): Promise<Study> {
    return this.studyModel.create(study);
  }

  async findAll(project: Project): Promise<Study[]> {
    return this.studyModel.find({ project: project._id.toString() });
  }

  async exists(studyName: string, project: string): Promise<boolean> {
    const study = await this.studyModel.findOne({ name: studyName, project });
    return !!study;
  }

  async findById(id: string): Promise<Study | null> {
    return this.studyModel.findById(id);
  }

  /** Validate that the tag data matches the study defined schema */
  async validateData(id: string, data: any): Promise<boolean> {
    // Get the study/schema for the data
    const study = await this.findById(id);
    if (!study) {
      throw new Error(`Study with id ${id} does not exist`);
    }
    const schema = study.tagSchema.dataSchema;

    // Validate the schema
    const validator = new Validator();
    return validator.validate(data, schema).valid;
  }

  async changeName(study: Study, newName: string): Promise<Study> {
    // Ensure the study name is unique
    if (await this.exists(newName, study.project)) {
      throw new BadRequestException(`Study with the name ${newName} already exists on the project ${study.project}`);
    }
    await this.studyModel.updateOne({ _id: study._id }, { $set: { name: newName } });
    return (await this.findById(study._id))!;
  }

  async changeDescription(study: Study, newDescription: string): Promise<Study> {
    await this.studyModel.updateOne({ _id: study._id }, { $set: { description: newDescription } });
    return (await this.findById(study._id))!;
  }

  async delete(study: Study): Promise<void> {
    await this.studyModel.deleteOne({ _id: study._id });
  }

  private async removeForProject(project: Project): Promise<void> {
    const studies = await this.findAll(project);
    for (const study of studies) {
      await this.delete(study);
    }
  }
}
