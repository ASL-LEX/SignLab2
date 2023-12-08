import { Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyResolver } from './study.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Study, StudySchema } from './study.model';
import { ProjectModule } from '../project/project.module';
import { StudyPipe } from './pipes/study.pipe';
import { StudyCreatePipe } from './pipes/create.pipe';
import { StudyDeletionService } from '../shared/service/study-delete.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name: Study.name,
      useFactory: (deletionService: StudyDeletionService) => {
        const schema = StudySchema;

        schema.pre('deleteOne', async function () {
          const study = await this.model.findOne(this.getQuery());
          await deletionService.apply(study);
        });

        return schema;
      },
      imports: [SharedModule],
      inject: [StudyDeletionService],
    }
  ]), ProjectModule, SharedModule],
  providers: [StudyService, StudyResolver, StudyPipe, StudyCreatePipe],
  exports: [StudyService, StudyPipe]
})
export class StudyModule {}
