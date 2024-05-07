import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getModelToken } from '@nestjs/mongoose';
import { Layout } from '@jsonforms/core'; 
import { StudyService } from '../../study/study.service';
import { MongooseMiddlewareService } from '../../shared/service/mongoose-callback.service';
import { TagTransformer } from './tag-transformer.service';
import { TrainingSetService } from './training-set.service';
import { Tag } from '../models/tag.model';
import { Study } from '../../study/study.model';
import { Entry } from '../../entry/models/entry.model';

describe('TagService', () => {
  let tagService: TagService;
  const mockTagModel = { create: jest.fn(), findOne: jest.fn(), find: jest.fn(), deleteMany: jest.fn(), updateOne: jest.fn(), findOneAndUpdate: jest.fn() };
  const mockStudyService = { validateData: jest.fn() };
  const mockMongooseMiddlewareService = { register: jest.fn() };
  const mockTagTransformer = { transformTagData: jest.fn() };
  const mockTrainingSetService = { findByStudy: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getModelToken(Tag.name),
          useValue: mockTagModel
        },
        {
          provide: StudyService,
          useValue: mockStudyService
        },
        {
          provide: MongooseMiddlewareService,
          useValue: mockMongooseMiddlewareService
        },
        {
          provide: TagTransformer,
          useValue: mockTagTransformer
        },
        {
          provide: TrainingSetService,
          useValue: mockTrainingSetService
        }
      ],
    }).compile();
    tagService = module.get<TagService>(TagService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCatchTrials', () => {
    it('should create catch trial tags for each entry', async () => {
      // Mock data
      const study: Study = {
        _id: 'studyId',
        name: 'Study Name',
        organization: 'Organization Name',
        description: 'Study Description',
        instructions: 'Study Instructions',
        tagSchema: { dataSchema: {}, uiSchema: {} as Layout }, // Cast uiSchema as Layout
        project: 'projectId',
        tagsPerEntry: 2
      };
      const entries: Entry[] = [
        {
          _id: 'entry1Id',
          organization: 'Organization ID',
          entryID: 'entryID1',
          bucketLocation: 'Bucket Location 1',
          contentType: 'Content Type 1',
          recordedInSignLab: true,
          dataset: 'Dataset ID',
          creator: 'Creator ID',
          dateCreated: new Date(),
          meta: {},
          signedURLExpiration: new Date(),
          isTraining: true
        },
        {
          _id: 'entry2Id',
          organization: 'Organization ID',
          entryID: 'entryID2',
          bucketLocation: 'Bucket Location 2',
          contentType: 'Content Type 2',
          recordedInSignLab: true,
          dataset: 'Dataset ID',
          creator: 'Creator ID',
          dateCreated: new Date(),
          meta: {},
          signedURLExpiration: new Date(),
          isTraining: false
        }
      ];
      // Mock tagModel.create to return a dummy tag
      const mockTag = {
        _id: 'tagId',
        entry: 'entryId',
        study: 'studyId',
        isCatchTrial: true,
        complete: false,
        order: 0,
        enabled: true,
        training: false
      };
      // Mock the tagModel.create method to return the dummy tag
      mockTagModel.create.mockResolvedValue(mockTag);
      // Call the method
      const result = await tagService.createCatchTrials(study, entries);
      console.log(result);
      // Assertions
      expect(mockTagModel.create).toHaveBeenCalledTimes(2); // Expect create to be called for each entry
      expect(mockTagModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          study: study._id,
          isCatchTrial: true,
          complete: false,
          order: 0,
          enabled: true,
          training: false
        })
      );
      expect(result).toHaveLength(2); // Expect the correct number of tags to be returned
      expect(result).toEqual( // Expect the the tags are Catch Trial tags
        expect.arrayContaining([
          expect.objectContaining({ isCatchTrial: true }),
          expect.objectContaining({ isCatchTrial: true })
        ])
      );
    });
  });
});