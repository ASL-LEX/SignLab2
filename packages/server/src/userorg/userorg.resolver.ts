import { Resolver } from '@nestjs/graphql';
import { Query, Mutation, Args } from '@nestjs/graphql';
import { UserOrgService } from './userorg.service';
import { OrganizationContext } from '../organization/organization.context';
import { Organization } from '../organization/organization.model';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';

@Resolver()
export class UserOrgResolver {
  constructor(private readonly userOrgService: UserOrgService) {}

  @Query(() => Boolean)
  async userIsInOrg(@Args('user') user: string, @Args('org') org: string): Promise<boolean> {
    return this.userOrgService.userIsInOrg(user, org);
  }

  @Mutation(() => Boolean)
  async addUserToOrg(@TokenContext() user: TokenPayload, @OrganizationContext() org: Organization): Promise<boolean> {
    await this.userOrgService.create(user.user_id, org._id.toString());
    return true;
  }
}
