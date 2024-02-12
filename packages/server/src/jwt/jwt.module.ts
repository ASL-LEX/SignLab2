import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [HttpModule, forwardRef(() => OrganizationModule)],
  providers: [JwtService, JwtAuthGuard, JwtStrategy],
  exports: [JwtService]
})
export class JwtModule {}
