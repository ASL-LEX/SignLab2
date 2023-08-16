import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './organization.model';
import { CreateOrganizationPipe } from './pipes/create.pipe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }])
  ],
  providers: [OrganizationResolver, OrganizationService, CreateOrganizationPipe]
})
export class OrganizationModule {}
