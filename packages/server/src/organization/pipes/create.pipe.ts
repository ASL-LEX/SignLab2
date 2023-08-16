import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { OrganizationCreate } from '../dtos/create.dto';
import { OrganizationService } from '../organization.service';

@Injectable()
export class CreateOrganizationPipe implements PipeTransform<OrganizationCreate, Promise<OrganizationCreate>> {
  constructor(private readonly orgService: OrganizationService) {}

  async transform(value: OrganizationCreate): Promise<OrganizationCreate> {
    const existingOrganization = await this.orgService.findByName(value.name);
    if (existingOrganization !== null) {
      throw new BadRequestException(`Organization with name ${value.name} already exists`);
    }
    return value;
  }
}
