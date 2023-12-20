import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { OrganizationModule } from '../organization/organization.module';
import { HttpModule } from '@nestjs/axios';
import { AuthZModule, AUTHZ_ENFORCER } from 'nest-authz';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import * as casbin from 'casbin';
import { MongooseAdapter } from 'casbin-mongoose-adapter';

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
    }),
    AuthZModule.register({
      enforcerProvider: {
        provide: AUTHZ_ENFORCER,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const model = configService.getOrThrow<string>('casbin.model');
          const policy = await MongooseAdapter.newAdapter(configService.getOrThrow<string>('mongo.uri'));
          return casbin.newEnforcer(model, policy);
        }
      },
      usernameFromContext: (context) => {
        // Return HTTP context
        if (context.getType() === 'http') {
          return context.switchToHttp().getRequest();
        }
        // Return GraphQL context
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
      }
    })
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    {
      provide: JwtStrategy,
      inject: [AuthService],
      useFactory: async (authService: AuthService) => {
        const key = await authService.getPublicKey();
        return new JwtStrategy(key);
      }
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}
