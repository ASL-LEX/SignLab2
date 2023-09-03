import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';

@Injectable()
export class ProjectPipe implements PipeTransform<string, Promise<Project>> {
  constructor(private readonly projectService: ProjectService) {}

  async transform(value: string): Promise<Project> {
    const project = await this.projectService.findById(value);
    if (!project) {
      throw new BadRequestException(`Project with ID ${value} does not exist`);
    }
    return project;
  }
}
