import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtService {
  private publicKey: string | null = null;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  // TODO: In the future this will be replaced by a library which handles
  // key rotation
  async queryForPublicKey(): Promise<string> {
    const query = this.configService.getOrThrow('auth.publicKeyUrl');

    const response = await firstValueFrom(this.httpService.get(query));
    return response.data[0];
  }

  async getPublicKey(): Promise<string> {
    if (this.publicKey === null) {
      this.publicKey = await this.queryForPublicKey();
    }

    return this.publicKey;
  }
}
