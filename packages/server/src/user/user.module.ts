import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { GcpModule } from '../gcp/gcp.module';

@Module({
  imports: [GcpModule],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
