import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

interface PublicKeys {
  [key: string]: string;
}

@Injectable()
export class JwtService {
  private publicKeys: PublicKeys | null = null;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  private async queryForPublicKey(): Promise<PublicKeys> {
    const query = this.configService.getOrThrow('auth.publicKeyUrl');

    const response = await firstValueFrom(this.httpService.get<{ [key: string]: string }>(query));
    return response.data;
  }

  async getPublicKey(kid: string): Promise<string | null> {
    if (!this.publicKeys || !this.publicKeys[kid]) {
      this.publicKeys = await this.queryForPublicKey();
    }
    return this.publicKeys[kid] || null;
  }

  async validate(rawToken: string): Promise<any | null> {
    // Parse out the token
    const tokenString = rawToken.split(' ')[1];
    const token = jwt.decode(tokenString, { complete: true }) as any;

    // Get the kid to verify the JWT against
    const kid = token.header.kid;
    if (!kid) {
      return null;
    }

    const publicKey = await this.getPublicKey(kid);
    if (!publicKey) {
      return null;
    }

    try {
      jwt.verify(tokenString, publicKey);
      return token.payload;
    } catch (e) {
      return null;
    }
  }
}
