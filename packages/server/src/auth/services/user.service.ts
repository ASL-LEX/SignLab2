import { Inject, Injectable } from '@nestjs/common';
import { AUTH_SDK_PROVIDER } from '../providers/sdk.provider';
import { Sdk, UserModel } from '../graphql/sdk';


@Injectable()
export class UserService {
  constructor(@Inject(AUTH_SDK_PROVIDER) private readonly authSdk: Sdk) {}

  async getUsersForProject(projectId: string): Promise<UserModel[]> {
    const { projectUsers } = await this.authSdk.projectUsers({ projectId });

    return projectUsers;
  }
}
