import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './organization.model';
import { CreateOrganizationPipe } from './pipes/create.pipe';
import { UserOrgModule } from '../userorg/userorg.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]), UserOrgModule],
  providers: [OrganizationResolver, OrganizationService, CreateOrganizationPipe],
  exports: [OrganizationService]
})
export class OrganizationModule {}
