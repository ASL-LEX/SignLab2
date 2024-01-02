import { Provider } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as casbin from 'casbin';
import { MongooseAdapter } from 'casbin-mongoose-adapter';

export const CASBIN_PROVIDER = 'CASBIN_PROVIDER';

export const casbinProvider: Provider<casbin.Enforcer> = {
  provide: CASBIN_PROVIDER,
  useFactory: async (configService: ConfigService) => {
    const model = configService.getOrThrow<string>('casbin.model');
    const policy = await MongooseAdapter.newAdapter(configService.getOrThrow<string>('casbin.mongo.uri'));

    return await casbin.newEnforcer(model, policy);
  },
  inject: [ConfigService]
};
