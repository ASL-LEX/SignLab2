import { Injectable, BadGatewayException, UnauthorizedException } from '@nestjs/common';
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

  async authenticate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, _options?: any): Promise<void> {
    // Check if the token is present
    const rawToken = req.headers.authorization;
    if (!rawToken) {
      throw new UnauthorizedException();
    }

    // Validate the token
    const valid = await this.jwtService.validate(rawToken);
    if (!valid) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Need to add the organization at this step since the organization is
   * queried from the database and not part of the JWT token. This allows
   * the organization to then be pulled in via the organization context
   */
  async validate(payload: TokenPayload): Promise<JwtStrategyValidate> {
    const organization = await this.organizationService.findByProject(payload.projectId);
    if (!organization) {
      throw new BadGatewayException('Organization not found');
    }

    return {
      ...payload,
      organization: organization
    };
  }
}
