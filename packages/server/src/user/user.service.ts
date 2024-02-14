import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_PROVIDER } from '../gcp/providers/firebase.provider';
import * as admin from 'firebase-admin';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@Inject(FIREBASE_PROVIDER) private readonly firebase: admin.app.App) {}

  async getUsersForTenant(tenantId: string): Promise<User[]> {
    const tenantAuth = this.firebase.auth().tenantManager().authForTenant(tenantId);

    const users = await tenantAuth.listUsers();
    return users.users;
  }

  async getUserById(tenantId: string, userId: string): Promise<User> {
    const tenantAuth = this.firebase.auth().tenantManager().authForTenant(tenantId);

    return tenantAuth.getUser(userId);
  }
}
