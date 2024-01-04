import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { TokenContext } from '../jwt/token.context';
import { TokenPayload } from '../jwt/token.dto';
import { AuthService } from './auth.service';
import { OrganizationContext } from 'src/organization/organization.context';
import { Organization } from 'src/organization/organization.model';

@UseGuards(JwtAuthGuard)
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  async grantOwner(
    @Args('targetUser', { type: () => ID }) targetUser: string,
    @TokenContext() requestingUser: TokenPayload,
    @OrganizationContext() organization: Organization
  ): Promise<boolean> {
    await this.authService.grantOwner(targetUser, requestingUser.id, organization._id);
    return true;
  }
}
