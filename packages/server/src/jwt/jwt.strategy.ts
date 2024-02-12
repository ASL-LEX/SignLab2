import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TokenPayload } from './token.dto';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async authenticate(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    _options?: any
  ): Promise<void> {
    // Check if the token is present
    const rawToken = req.headers.authorization;
    if (!rawToken) {
      this.fail({ meessage: 'Invalid Token' }, 400);
      return;
    }

    // Validate the token
    const payload = await this.jwtService.validate(rawToken);
    if (!payload) {
      this.fail({ message: 'Invalid Token' }, 400);
      return;
    }

    const result = await this.validate(payload);
    this.success(result);
  }

  /**
   * Need to add the organization at this step since the organization is
   * queried from the database and not part of the JWT token. This allows
   * the organization to then be pulled in via the organization context
   */
  async validate(payload: TokenPayload): Promise<TokenPayload> {
    return {
      ...payload
    };
  }
}
