import { Module, forwardRef } from '@nestjs/common';
import {
  JwtModule as NestJwtModule,
  JwtModuleOptions as NestJwtModuleOptions
} from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [forwardRef(() => JwtModule)],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => {
        const options: NestJwtModuleOptions = {
          publicKey: await jwtService.getPublicKey(),
          signOptions: {
            algorithm: 'RS256',
          }
        };
        return options;
      },
    }),
    HttpModule,
    forwardRef(() => OrganizationModule)
  ],
  providers: [
    JwtService,
    JwtAuthGuard,
    {
      provide: JwtStrategy,
      inject: [JwtService, OrganizationService],
      useFactory: async (jwtService: JwtService, organizationService: OrganizationService) => {
        const key = await jwtService.getPublicKey();
        return new JwtStrategy(key, organizationService);
      }
    }
  ],
  exports: [JwtService]
})
export class JwtModule {}
