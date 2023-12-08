import { Module } from '@nestjs/common';
import { MongooseMiddlewareService } from './service/mongoose-callback.service';

@Module({
  providers: [MongooseMiddlewareService],
  exports: [MongooseMiddlewareService]
})
export class SharedModule {}
