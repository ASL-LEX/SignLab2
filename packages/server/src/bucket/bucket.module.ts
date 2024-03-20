import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketInfo, BucketInfoSchema } from './bucket-info.model';
import { BucketFactory } from './bucket-factory.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: BucketInfo.name, schema: BucketInfoSchema }])],
  providers: [BucketFactory],
  exports: [BucketFactory]
})
export class BucketModule {}
