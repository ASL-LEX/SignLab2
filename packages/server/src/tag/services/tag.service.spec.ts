import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { getModelToken } from '@nestjs/mongoose';
import { Study } from '../../study/study.model';
import { Layout } from '@jsonforms/core'; // Import Layout interface
import { JsonSchema } from '@jsonforms/core'; // Import JsonSchema interface
import { Entry } from '../../entry/models/entry.model';
describe('TagService', () => {
  let tagService: TagService;
  const tagModelMock = {
    create: jest.fn()
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getModelToken('Tag'), // Use the string name 'Tag' instead of Tag.name
          useValue: tagModelMock
        }
      ]
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
      tagModelMock.create.mockResolvedValue(mockTag);
      // Call the method
      const result = await tagService.createCatchTrials(study, entries);
      // Assertions
      expect(tagModelMock.create).toHaveBeenCalledTimes(2); // Expect create to be called for each entry
      expect(tagModelMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          study: study._id,
          isCatchTrial: true,
          complete: false,
          order: 0, // Or assert any other properties you expect
          enabled: true,
          training: false
        })
      );
      expect(result).toHaveLength(2); // Expect the correct number of tags to be returned
    });
  });
});