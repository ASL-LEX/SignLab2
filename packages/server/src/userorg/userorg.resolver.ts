import { ID, Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserOrgService } from './userorg.service';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserOrgResolver {
  constructor(private readonly userOrgService: UserOrgService) {}

  @Query(() => Boolean)
  async userIsInOrg(@Args('user') user: string, @Args('org') org: string): Promise<boolean> {
    return this.userOrgService.userIsInOrg(user, org);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async addUserToOrg(
    @Args('organization', { type: () => ID }) organization: string,
    @TokenContext() user: TokenPayload
  ): Promise<boolean> {
    await this.userOrgService.create(user.user_id, organization);
    return true;
  }
}
