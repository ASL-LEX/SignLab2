import { ID, Mutation, Resolver, Args, Query, ResolveField, Parent } from '@nestjs/graphql';
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
import { DatasetProjectPermission } from '../models/dataset.model';
import { DatasetService } from '../../dataset/dataset.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => DatasetProjectPermission)
export class DatasetPermissionResolver {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly permissionService: PermissionService,
    private readonly datasetService: DatasetService
  ) {}

  @Mutation(() => Boolean)
  async grantProjectDatasetAccess(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @Args('dataset', { type: () => ID }, DatasetPipe) dataset: Dataset,
    @Args('hasAccess') hasAccess: boolean,
    @TokenContext() requestingUser: TokenPayload
  ) {
    // Make sure the requesting user has access
    const hasPermission = await this.enforcer.enforce(requestingUser.user_id, DatasetPermissions.GRANT_ACCESS, dataset._id);
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage dataset permissions');
    }

    return this.permissionService.grantProjectDatasetAccess(project, dataset, hasAccess);
  }

  @Query(() => [DatasetProjectPermission])
  async getDatasetProjectPermissions(
    @Args('project', { type: () => ID }, ProjectPipe) project: Project,
    @TokenContext() requestingUser: TokenPayload
  ) {
    // Make sure the requesting user has access
    const hasPermission = await this.enforcer.enforce(requestingUser.user_id, DatasetPermissions.GRANT_ACCESS, project._id);
    if (!hasPermission) {
      throw new UnauthorizedException('Requesting user does not have permission to manage dataset permissions');
    }

    return this.permissionService.getDatasetProjectPermissions(project);
  }

  @ResolveField(() => Dataset)
  async dataset(@Parent() datasetProjectPermission: DatasetProjectPermission) {
    return this.datasetService.findById(datasetProjectPermission.dataset);
  }
}
