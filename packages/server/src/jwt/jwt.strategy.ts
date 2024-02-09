import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { TokenPayload } from './token.dto';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from 'src/organization/organization.model';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { JwtService } from './jwt.service';

interface JwtStrategyValidate extends TokenPayload {
  organization: Organization;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly organizationService: OrganizationService, private readonly jwtService: JwtService) {
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
      this.fail({ meessage: 'Invalid Token' }, 400);
      return;
    }

    this.success(await this.validate(payload));
  }

  /**
   * Need to add the organization at this step since the organization is
   * queried from the database and not part of the JWT token. This allows
   * the organization to then be pulled in via the organization context
   */
  async validate(payload: TokenPayload): Promise<JwtStrategyValidate> {
    // TODO: Change out hardcoded project ID
    const organization = await this.organizationService.findByProject('fe231d0b-5f01-4e52-9bc1-561e76b1e02d');
    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    return {
      ...payload,
      organization: organization
    };
  }
}
