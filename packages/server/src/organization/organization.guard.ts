import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly organizationService: OrganizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    const organization = await this.organizationService.findByTenantID(user.firebase.tenant);
    if (!organization) {
      return false;
    }

    // Add the organization to the request
    ctx.getContext().req.organization = organization;

    return true;
  }
}
