import { Module } from '@nestjs/common';
import { StudyDeletionService } from './service/study-delete.service';

@Module({
  providers: [StudyDeletionService],
  exports: [StudyDeletionService]
})
export class SharedModule {}
