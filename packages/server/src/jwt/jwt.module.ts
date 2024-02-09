import { Module, forwardRef } from '@nestjs/common';
import { JwtModule as NestJwtModule, JwtModuleOptions as NestJwtModuleOptions } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => OrganizationModule)
  ],
  providers: [
    JwtService,
    JwtAuthGuard,
    JwtStrategy
  ],
  exports: [JwtService]
})
export class JwtModule {}
