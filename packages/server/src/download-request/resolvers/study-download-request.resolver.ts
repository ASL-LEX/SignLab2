import { Resolver, Mutation, Args, ResolveField, Parent, ID, Query } from '@nestjs/graphql';
import { JwtAuthGuard } from '../../jwt/jwt.guard';
import { OrganizationGuard } from '../../organization/organization.guard';
import { UseGuards } from '@nestjs/common';
import { StudyDownloadRequest } from '../models/study-download-request.model';
import { StudyDownloadService } from '../services/study-download-request.service';
import { CreateStudyDownloadPipe } from '../pipes/study-download-request-create.pipe';
import { CreateStudyDownloadRequest } from '../dtos/study-download-request-create.dto';
import { OrganizationContext } from '../../organization/organization.context';
import { Organization } from '../../organization/organization.model';
import { StudyPipe } from '../../study/pipes/study.pipe';
import { Study } from '../../study/study.model';

@UseGuards(JwtAuthGuard, OrganizationGuard)
@Resolver(() => StudyDownloadRequest)
export class StudyDownloadRequestResolver {
  constructor(private readonly studyDownloadService: StudyDownloadService, private readonly studyPipe: StudyPipe) {}

  @Mutation(() => StudyDownloadRequest)
  async createStudyDownload(
    @Args('downloadRequest', CreateStudyDownloadPipe) downloadRequest: CreateStudyDownloadRequest,
    @OrganizationContext() organization: Organization
  ): Promise<StudyDownloadRequest> {
    return this.studyDownloadService.createDownloadRequest(downloadRequest, organization);
  }

  @Query(() => [StudyDownloadRequest])
  async getStudyDownloads(
    @Args('study', { type: () => ID }, StudyPipe) study: Study
  ): Promise<StudyDownloadRequest[]> {
    return this.studyDownloadService.getStudyDownloads(study);
  }

  @ResolveField(() => String)
  async entryZip(@Parent() downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.studyDownloadService.getEntryZipUrl(downloadRequest);
  }

  @ResolveField(() => Study)
  async study(@Parent() downloadRequest: StudyDownloadRequest): Promise<Study> {
    return this.studyPipe.transform(downloadRequest.study);
  }

  @ResolveField(() => String)
  async tagCSV(@Parent() downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.studyDownloadService.getTagCSVUrl(downloadRequest);
  }

  @ResolveField(() => String)
  async taggedEntries(@Parent() downloadRequest: StudyDownloadRequest): Promise<string> {
    return this.studyDownloadService.getTaggedEntriesUrl(downloadRequest);
  }
}
