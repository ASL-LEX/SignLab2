import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { OrganizationModule } from '../organization/organization.module';
import { HttpModule } from '@nestjs/axios';
import { casbinProvider } from './casbin.provider';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    PassportModule,
    OrganizationModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [forwardRef(() => AuthModule)],
      inject: [AuthService],
      useFactory: async (authService: AuthService) => {
        const options: JwtModuleOptions = {
          publicKey: await authService.getPublicKey(),
          signOptions: {
            algorithm: 'RS256'
          }
        };
        return options;
      }
    })
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    casbinProvider,
    AuthResolver,
    {
      provide: JwtStrategy,
      inject: [AuthService],
      useFactory: async (authService: AuthService) => {
        const key = await authService.getPublicKey();
        return new JwtStrategy(key);
      }
    }
  ],
  exports: [AuthService, casbinProvider]
})
export class AuthModule {}
