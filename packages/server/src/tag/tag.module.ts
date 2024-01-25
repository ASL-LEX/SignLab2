import { Module } from '@nestjs/common';
import { TagService } from './services/tag.service';
import { TagResolver } from './resolvers/tag.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './models/tag.model';
import { StudyModule } from '../study/study.module';
import { EntryModule } from '../entry/entry.module';
import { TagPipe } from './pipes/tag.pipe';
import { SharedModule } from '../shared/shared.module';
import { PermissionModule } from '../permission/permission.module';
import { VideoField, VideoFieldSchema } from './models/video-field.model';
import { VideoFieldService } from './services/video-field.service';
import { VideoFieldResolver } from './resolvers/video-field.resolver';
import { GcpModule } from '../gcp/gcp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }, { name: VideoField.name, schema: VideoFieldSchema }]),
    StudyModule,
    EntryModule,
    SharedModule,
    PermissionModule,
    GcpModule
  ],
  providers: [TagService, TagResolver, TagPipe, VideoFieldService, VideoFieldResolver]
})
export class TagModule {}
