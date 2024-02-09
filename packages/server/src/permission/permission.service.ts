import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CASBIN_PROVIDER } from './casbin.provider';
import * as casbin from 'casbin';
import { Roles } from './permissions/roles';
import { UserService } from '../auth/services/user.service';
import { Project } from '../project/project.model';
import { TokenPayload } from '../jwt/token.dto';
import { Study } from '../study/study.model';
import { ProjectPermissionModel } from './models/project.model';
import { StudyPermissionModel } from './models/study.model';
import { Dataset } from '../dataset/dataset.model';
import { DatasetService } from '../dataset/dataset.service';
import { DatasetProjectPermission } from './models/dataset.model';
import { Permission } from './models/permission.model';
import { Organization } from '../organization/organization.model';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(CASBIN_PROVIDER) private readonly enforcer: casbin.Enforcer,
    private readonly userService: UserService,
    private readonly datasetService: DatasetService
  ) {}

  /** requestingUser must be an owner themselves */
  async grantOwner(targetUser: string, organization: string): Promise<void> {
    await this.enforcer.addPolicy(targetUser, Roles.OWNER, organization);
  }

  async getProjectPermissions(project: Project, _requestingUser: TokenPayload): Promise<ProjectPermissionModel[]> {
    // Get all the users associated with the organization
    // TODO: Change out hardcoded project ID
    const users = await this.userService.getUsersForProject('fe231d0b-5f01-4e52-9bc1-561e76b1e02d');

    // Create the cooresponding permission representation
    const permissions = await Promise.all(
      users.map(async (user) => {
        const hasRole = await this.enforcer.enforce(user.id, Roles.PROJECT_ADMIN, project._id);
        const editable = !(await this.enforcer.enforce(user.id, Roles.OWNER, project._id));

        return {
          user: user.id,
          isProjectAdmin: hasRole,
          editable
        };
      })
    );

    return permissions;
  }

  async grantProjectPermissions(
    project: Project,
    user: string,
    isAdmin: boolean,
    requestingUser: TokenPayload
  ): Promise<boolean> {
    // Make sure the target user is not an owner
    const isOwner = await this.enforcer.enforce(user, Roles.OWNER, project._id);
    if (isOwner) {
      throw new UnauthorizedException('Target user is an owner');
    }

    // The user cannot change its own permissions
    if (user === requestingUser.user_id) {
      throw new UnauthorizedException('Cannot change your own permissions');
    }

    // Otherwise grant the permissions
    if (isAdmin) {
      await this.enforcer.addPolicy(user, Roles.PROJECT_ADMIN, project._id.toString());
    } else {
      await this.enforcer.removePolicy(user, Roles.PROJECT_ADMIN, project._id.toString());
    }

    return true;
  }

  async getStudyPermissions(study: Study, _requestingUser: TokenPayload): Promise<StudyPermissionModel[]> {
    // Get all the users associated with the organization
    // TODO: Change out hardcoded project ID
    const users = await this.userService.getUsersForProject('fe231d0b-5f01-4e52-9bc1-561e76b1e02d');

    // Create the cooresponding permission representation
    const permissions = await Promise.all(
      users.map(async (user) => {
        const isStudyAdmin = await this.enforcer.enforce(user.id, Roles.STUDY_ADMIN, study._id.toString());
        const isStudyAdminEditable = !(await this.enforcer.enforce(user.id, Roles.PROJECT_ADMIN, study._id.toString()));

        const isContributor = await this.enforcer.enforce(user.id, Roles.CONTRIBUTOR, study._id.toString());
        const isContributorEditable = !(await this.enforcer.enforce(user.id, Roles.STUDY_ADMIN, study._id.toString()));

        const isTrained = await this.enforcer.enforce(user.id, Roles.TRAINED_CONTRIBUTOR, study._id.toString());

        return {
          user: user.id,
          isStudyAdmin,
          isStudyAdminEditable,
          isContributor,
          isContributorEditable,
          isTrained,
          isTrainedEditable: true
        };
      })
    );

    // return permissions;
    return permissions;
  }

  async grantStudyAdmin(study: Study, user: string, isAdmin: boolean, requestingUser: TokenPayload): Promise<boolean> {
    // Make sure the target user is not a project admin
    const isProjectAdmin = await this.enforcer.enforce(user, Roles.PROJECT_ADMIN, study._id);
    if (isProjectAdmin) {
      throw new UnauthorizedException('Target user is an owner');
    }

    // The user cannot change its own permissions
    if (user === requestingUser.user_id) {
      throw new UnauthorizedException('Cannot change your own permissions');
    }

    // Otherwise grant the permissions
    if (isAdmin) {
      await this.enforcer.addPolicy(user, Roles.STUDY_ADMIN, study._id.toString());
    } else {
      await this.enforcer.removePolicy(user, Roles.STUDY_ADMIN, study._id.toString());
    }

    return true;
  }

  async grantContributor(
    study: Study,
    user: string,
    isContributor: boolean,
    requestingUser: TokenPayload
  ): Promise<boolean> {
    // Make sure the target user is not a study admin
    const isStudyAdmin = await this.enforcer.enforce(user, Roles.STUDY_ADMIN, study._id.toString());
    if (isStudyAdmin) {
      throw new UnauthorizedException('Target user is an owner');
    }

    // The user cannot change its own permissions
    if (user === requestingUser.user_id) {
      throw new UnauthorizedException('Cannot change your own permissions');
    }

    // Otherwise grant the permissions
    if (isContributor) {
      await this.enforcer.addPolicy(user, Roles.CONTRIBUTOR, study._id.toString());
    } else {
      await this.enforcer.removePolicy(user, Roles.CONTRIBUTOR, study._id.toString());
    }

    return true;
  }

  async grantTrainedContributor(
    study: Study,
    user: string,
    isTrained: boolean,
    _requestingUser: TokenPayload
  ): Promise<boolean> {
    if (isTrained) {
      await this.enforcer.addPolicy(user, Roles.TRAINED_CONTRIBUTOR, study._id.toString());
    } else {
      await this.enforcer.removePolicy(user, Roles.TRAINED_CONTRIBUTOR, study._id.toString());
    }
    return true;
  }

  async grantProjectDatasetAccess(project: Project, dataset: Dataset, hasAccess: boolean): Promise<boolean> {
    if (hasAccess) {
      await this.enforcer.addNamedGroupingPolicy('g2', project._id.toString(), dataset._id.toString());
    } else {
      await this.enforcer.removeNamedGroupingPolicy('g2', project._id.toString(), dataset._id.toString());
    }
    return true;
  }

  async getDatasetProjectPermissions(project: Project): Promise<DatasetProjectPermission[]> {
    const datasets = await this.datasetService.findAll(project.organization);

    return await Promise.all(
      datasets.map(async (dataset) => {
        const hasAccess = await this.enforcer.hasNamedGroupingPolicy(
          'g2',
          project._id.toString(),
          dataset._id.toString()
        );

        return {
          dataset: dataset._id.toString(),
          projectHasAccess: hasAccess
        };
      })
    );
  }

  async getRoles(
    user: TokenPayload,
    organization: Organization,
    project: Project | null,
    study: Study | null
  ): Promise<Permission> {
    return {
      owner: await this.enforcer.enforce(user.user_id, Roles.OWNER, organization._id.toString()),
      projectAdmin: project ? await this.enforcer.enforce(user.user_id, Roles.PROJECT_ADMIN, project._id.toString()) : false,
      studyAdmin: study ? await this.enforcer.enforce(user.user_id, Roles.STUDY_ADMIN, study._id.toString()) : false,
      trainedContributor: study
        ? await this.enforcer.enforce(user.user_id, Roles.TRAINED_CONTRIBUTOR, study._id.toString())
        : false,
      contributor: study ? await this.enforcer.enforce(user.user_id, Roles.CONTRIBUTOR, study._id.toString()) : false
    };
  }
}
