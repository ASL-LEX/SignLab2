import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly signlabPingUrl = this.configService.getOrThrow<string>('signlab.uri');

  constructor(
    private readonly health: HealthCheckService,
    private readonly configService: ConfigService,
    private readonly http: HttpHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      // This is a GraphQL endpoint so will return a bad request exception, but that is to be expected
      () => this.http.responseCheck('signlab', this.signlabPingUrl, (res) => res.status === 400)
    ]);
  }
}
