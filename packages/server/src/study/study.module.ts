import { Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyResolver } from './study.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Study, StudySchema } from './study.model';
import { ProjectModule } from '../project/project.module';
import { StudyPipe } from './pipes/study.pipe';
import { StudyCreatePipe } from './pipes/create.pipe';
import { MongooseMiddlewareService } from '../shared/service/mongoose-callback.service';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name: Study.name,
      useFactory: (middlewareService: MongooseMiddlewareService) => {
        const schema = StudySchema;

        schema.pre('deleteOne', async function () {
          const study = await this.model.findOne(this.getQuery());
          await middlewareService.apply(Study.name, 'deleteOne', study);
        });

        return schema;
      },
      imports: [SharedModule],
      inject: [MongooseMiddlewareService],
    }
  ]), ProjectModule, SharedModule, AuthModule],
  providers: [StudyService, StudyResolver, StudyPipe, StudyCreatePipe],
  exports: [StudyService, StudyPipe]
})
export class StudyModule {}
