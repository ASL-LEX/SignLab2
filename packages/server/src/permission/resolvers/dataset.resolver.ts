import { ID, Mutation, Resolver, Args } from '@nestjs/graphql';
import { Inject, UseGuards, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { CASBIN_PROVIDER } from '../casbin.provider';
import * as casbin from 'casbin';
import { PermissionService } from '../permission.service';
import { ProjectPipe } from '../../project/pipes/project.pipe';
import { Project } from '../../project/project.model';
import { DatasetPipe } from '../../dataset/pipes/dataset.pipe';
import { Dataset } from '../../dataset/dataset.model';
import { TokenContext } from '../../jwt/token.context';
import { TokenPayload } from '../../jwt/token.dto';
import { DatasetPermissions } from '../permissions/dataset';


@UseGuards(JwtAuthGuard)
@Resolver()
export class DatasetPermissionResolver {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly permissionService: PermissionService,
  ) {}


  @Mutation(() => Boolean)
  async grantProjectDatasetAccess(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @TokenContext() requestingUser: TokenPayload
  ) {
    // Make sure the requesting user has access
    const hasPermission = await this.enforcer.enforce(requestingUser.id, DatasetPermissions.GRANT_ACCESS, dataset._id);
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage dataset permissions');
    }

    return this.permissionService.grantProjectDatasetAccess(project, dataset);
  }

}
