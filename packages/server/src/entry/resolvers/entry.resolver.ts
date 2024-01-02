import { Args, ID, Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Dataset } from '../../dataset/dataset.model';
import { Entry } from '../models/entry.model';
import { EntryService } from '../services/entry.service';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { UseGuards, Inject, UnauthorizedException} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { DatasetPermissions } from '../../auth/permissions/dataset';
import { CASBIN_PROVIDER } from '../../auth/casbin.provider';
import * as casbin from 'casbin';
import { TokenPayload } from '../../auth/user.dto';
import { UserContext } from '../../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Resolver(() => Entry)
export class EntryResolver {
  constructor(private readonly entryService: EntryService, @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer) {}

  @Query(() => [Entry])
  async entryForDataset(@Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset, @UserContext() user: TokenPayload): Promise<Entry[]> {
    if (!(await this.enforcer.enforce(user.id, DatasetPermissions.READ, dataset._id))) {
      throw new UnauthorizedException('User cannot read entries on this dataset');
    }

    return this.entryService.findForDataset(dataset);
  }

  @ResolveField(() => String)
  async signedUrl(@Parent() entry: Entry): Promise<string> {
    if (!(await this.enforcer.enforce(entry.dataset, DatasetPermissions.READ, entry.dataset))) {
      throw new UnauthorizedException('User cannot read entries on this dataset');
    }

    return this.entryService.getSignedUrl(entry);
  }

  // NOTE: With the current implementation, this is only really helpful
  //       if the request to `signedUrl` is made.
  @ResolveField(() => Number, { description: 'Get the number of milliseconds the signed URL is valid for.' })
  async signedUrlExpiration(@Parent() entry: Entry): Promise<number> {
    if (!(await this.enforcer.enforce(entry.dataset, DatasetPermissions.READ, entry.dataset))) {
      throw new UnauthorizedException('User cannot read entries on this dataset');
    }

    return this.entryService.getSignedUrlExpiration(entry);
  }
}
