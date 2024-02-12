import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from './token.dto';
import { JwtService } from './jwt.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (_request: Request, rawJwtToken: any, done: (err: any, secretOrKey?: string | Buffer) => void) => {
        // Can only verify tokens via the Google public key
        jwtService.getPublicKey(rawJwtToken)
          .then((publicKey) => {
            if (!publicKey) {
              done(new Error('No public key found for token'));
              return;
            }
            done(null, publicKey);
          })
          .catch((err) => {
            done(err);
          });
        }
      });
  }

  async validate(payload: TokenPayload): Promise<TokenPayload> {
    return {
      ...payload
    };
  }
}
