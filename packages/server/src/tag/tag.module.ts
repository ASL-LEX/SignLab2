import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './tag.model';
import { StudyModule } from '../study/study.module';
import { EntryModule } from '../entry/entry.module';
import { TagPipe } from './pipes/tag.pipe';
import { SharedModule } from '../shared/shared.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    StudyModule,
    EntryModule,
    SharedModule,
    PermissionModule
  ],
  providers: [TagService, TagResolver, TagPipe]
})
export class TagModule {}
