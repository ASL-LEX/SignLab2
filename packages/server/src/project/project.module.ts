import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.model';
import { ProjectPipe } from './pipes/project.pipe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])
  ],
  providers: [ProjectResolver, ProjectService, ProjectPipe],
  exports: [ProjectPipe, ProjectService]
})
export class ProjectModule {}
