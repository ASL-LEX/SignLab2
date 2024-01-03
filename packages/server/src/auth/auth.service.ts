import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CASBIN_PROVIDER } from './casbin.provider';
import * as casbin from 'casbin';
import { Roles } from './roles';

@Injectable()
export class AuthService {
  private publicKey: string | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer
  ) {}

  // TODO: In the future this will be replaced by a library which handles
  // key rotation
  async queryForPublicKey(): Promise<string> {
    const query = this.configService.getOrThrow('auth.publicKeyUrl');

    const response = await firstValueFrom(this.httpService.get(query));
    return response.data[0];
  }

  /** requestingUser must be an owner themselves */
  async grantOwner(targetUser: string, requestingUser: string, organization: string): Promise<void> {
    // Make sure the requesting user is an owner
    const isOwner = await this.enforcer.enforce(requestingUser, Roles.OWNER, organization);
    if (!isOwner) {
      throw new UnauthorizedException('Requesting user is not an owner');
    }

    await this.enforcer.addPolicy(targetUser, Roles.OWNER, organization);
  }

  async getPublicKey(): Promise<string> {
    if (this.publicKey === null) {
      this.publicKey = await this.queryForPublicKey();
    }

    return this.publicKey;
  }
}
