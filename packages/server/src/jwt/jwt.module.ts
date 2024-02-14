import { Module, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { OrganizationModule } from '../organization/organization.module';
import { JwtSecretRequestType, JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => OrganizationModule),
    NestJwtModule.registerAsync({
      imports: [forwardRef(() => JwtModule)],
      inject: [JwtService],
      useFactory: (jwtService: JwtService) => ({
        secretOrKeyProvider: async (requestType, rawJwtToken) => {
          // Can only verify tokens via the Google public key
          switch (requestType) {
            case JwtSecretRequestType.SIGN:
              throw new Error('Cannot sign tokens');
            case JwtSecretRequestType.VERIFY:
              const publicKey = await jwtService.getPublicKey(rawJwtToken);
              if (!publicKey) {
                throw new UnauthorizedException('No public key found for token');
              }
              return publicKey;
            default:
              throw new Error('Invalid request type');
          }
        }
      })
    })
  ],
  providers: [JwtService, JwtAuthGuard, JwtStrategy],
  exports: [JwtService]
})
export class JwtModule {}
