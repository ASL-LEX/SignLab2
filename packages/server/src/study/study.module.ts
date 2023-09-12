import { Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyResolver } from './study.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Study, StudySchema } from './study.model';
import { ProjectModule } from '../project/project.module';
import { StudyPipe } from './pipes/study.pipe';
import { StudyCreatePipe } from './pipes/create.pipe';

@Module({
  imports: [MongooseModule.forFeature([{ name: Study.name, schema: StudySchema }]), ProjectModule],
  providers: [StudyService, StudyResolver, StudyPipe, StudyCreatePipe],
  exports: [StudyService, StudyPipe]
})
export class StudyModule {}
