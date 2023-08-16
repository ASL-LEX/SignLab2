import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {OrganizationCreate} from './dtos/create.dto';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import { CreateOrganizationPipe } from './pipes/create.pipe';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly orgService: OrganizationService) {}

  @Query(() => [Organization])
  async getOrganizations(): Promise<Organization[]> {
    return this.orgService.find();
  }

  @Query(() => Boolean)
  async exists(@Args('name') name: string): Promise<boolean> {
    const existingProject = await this.orgService.findByName(name);
    return existingProject !== null;
  }

  // TODO: Add authentication guard
  @Mutation(() => Organization)
  async createOrganization(@Args('organization', CreateOrganizationPipe) organization: OrganizationCreate): Promise<Organization> {
    return this.orgService.create(organization);
  }
}
