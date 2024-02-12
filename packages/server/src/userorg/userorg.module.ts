import { Module } from '@nestjs/common';
import { UserOrgService } from './userorg.service';
import { UserOrg, UserOrgSchema } from './userorg.model';
import { MongooseModule } from '@nestjs/mongoose'
import { UserOrgResolver } from './userorg.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserOrg.name, schema: UserOrgSchema }])
  ],
  providers: [UserOrgService, UserOrgResolver]
})
export class UserOrgModule {}
