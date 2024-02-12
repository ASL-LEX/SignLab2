import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { UserOrgService } from '../userorg/userorg.service';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userOrgService: UserOrgService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    // Check for the organization in the headers
    const organizationID = ctx.getContext().req.headers.organization;
    if (organizationID == undefined || organizationID == 'undefined') {
      return false;
    }
    if (typeof organizationID !== 'string') {
      return false;
    }

    // Check if the organization exists
    const organization = await this.organizationService.findOne(organizationID);
    if (!organization) {
      return false;
    }

    // Check to see if the user is in the organization
    const user = ctx.getContext().req.user;
    if (!user) {
      return false;
    }
    const userOrg = await this.userOrgService.userIsInOrg(user.user_id, organizationID);
    if (!userOrg) {
      return false;
    }

    // Add the organization to the request
    ctx.getContext().req.organization = organization;

    return true;
  }
}
