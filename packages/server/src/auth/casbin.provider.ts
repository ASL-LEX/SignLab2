import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as casbin from 'casbin';
import { MongooseAdapter } from 'casbin-mongoose-adapter';
import { roleHierarchy } from './roles';
import { roleToStudyPermissions } from './permissions/study';
import { roleToProjectPermissions } from './permissions/project';
import { roleToTagPermissions } from './permissions/tag';
import { roleToDatasetPermissions } from './permissions/dataset';

export const CASBIN_PROVIDER = 'CASBIN_PROVIDER';

export const casbinProvider: Provider<casbin.Enforcer> = {
  provide: CASBIN_PROVIDER,
  useFactory: async (configService: ConfigService) => {
    const model = configService.getOrThrow<string>('casbin.model');
    const policy = await MongooseAdapter.newAdapter(configService.getOrThrow<string>('casbin.mongo.uri'));
    const enforcer = await casbin.newEnforcer(model, policy);

    // Add all the role mappings
    const groups = [
      ...roleHierarchy,
      ...roleToStudyPermissions,
      ...roleToProjectPermissions,
      ...roleToTagPermissions,
      ...roleToDatasetPermissions
    ];
    await Promise.all(groups.map((group) => enforcer.addNamedGroupingPolicy('g', ...group)));

    return enforcer;
  },
  inject: [ConfigService]
};
