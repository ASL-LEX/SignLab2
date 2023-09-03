import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Study } from './study.model';
import { StudyCreate } from './dtos/create.dto';

@Injectable()
export class StudyService {
  constructor(@InjectModel(Study.name) private readonly studyModel: Model<Study>) {}

  async create(study: StudyCreate): Promise<Study> {
    return this.studyModel.create(study);
  }

  async findAll(): Promise<Study[]> {
    return this.studyModel.find({});
  }

  async exists(studyName: string, project: string): Promise<boolean> {
    const study = await this.studyModel.findOne({ name: studyName, project });
    return !!study;
  }

  async findById(id: string): Promise<Study | null> {
    return this.studyModel.findById(id);
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
}
