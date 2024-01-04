import { Injectable, BadGatewayException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from './token.dto';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from 'src/organization/organization.model';

interface JwtStrategyValidate extends TokenPayload {
  organization: Organization;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(publicKey: string, private readonly organizationService: OrganizationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey
    });
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
