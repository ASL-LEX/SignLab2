import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrganizationCreate } from './dtos/create.dto';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import { CreateOrganizationPipe } from './pipes/create.pipe';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly orgService: OrganizationService) {}

  @Query(() => [Organization])
  async getOrganizations(): Promise<Organization[]> {
    return this.orgService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  async exists(@Args('name') name: string): Promise<boolean> {
    const existingProject = await this.orgService.findByName(name);
    return existingProject !== null;
  }

  // TODO: Add authentication guard
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Organization)
  async createOrganization(
    @Args('organization', CreateOrganizationPipe) organization: OrganizationCreate
  ): Promise<Organization> {
    return this.orgService.create(organization);
  }

  @Query(() => Organization)
  async getOrganizationFromTenant(@Args('tenant') tenant: string): Promise<Organization> {
    const org = await this.orgService.findByTenantID(tenant);
    if (!org) {
      throw new NotFoundException(`Organization with tenant id ${tenant} not found`);
    }
    return org;
  }
}
