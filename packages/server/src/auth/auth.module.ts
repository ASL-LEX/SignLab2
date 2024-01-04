import { Module } from '@nestjs/common';
import { authSDKProvider } from './providers/sdk.provider';
import { UserService } from './services/user.service';

@Module({
  providers: [authSDKProvider, UserService],
  exports: [UserService]
})
export class AuthModule {}
