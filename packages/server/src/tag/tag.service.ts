import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from './tag.model';
import { Model } from 'mongoose';
import { Study } from '../study/study.model';
import { Entry } from '../entry/models/entry.model';
import { StudyService } from '../study/study.service';
import { MongooseMiddlewareService } from '../shared/service/mongoose-callback.service';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<Tag>,
    private readonly studyService: StudyService,
    middlewareService: MongooseMiddlewareService
  ) {
    // Subscribe to study delete events
    middlewareService.register(Study.name, 'deleteOne', async (study: Study) => {
      await this.removeByStudy(study);
    });
  }

  async find(id: string): Promise<Tag | null> {
    return this.tagModel.findOne({ _id: id });
  }

  /**
   * Create the tags for the study entry combination. This will create a tag
   * for each entry plus the number of tags per entry are expected.
   *
   * For example, if there are 5 entries with 2 tags per entry, 10 tags will
   * be created.
   */
  async createTags(study: Study, entries: Entry[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    for (const entry of entries) {
      for (let order = 0; order < study.tagsPerEntry; order++) {
        const newTag = await this.tagModel.create({
          entry: entry._id,
          study: study._id,
          complete: false,
          order,
          enabled: true
        });
        tags.push(newTag);
      }
    }
    return tags;
  }

  /**
   * Assign the tag to the given user. If the user already has an incomplete
   * tag, return that tag to the user. If there are no more remaining tags,
   * null is returned.
   */
  async assignTag(study: Study, user: string): Promise<Tag | null> {
    // Check for incomplete tags
    const incomplete = await this.getIncomplete(study, user);
    if (incomplete) {
      return incomplete;
    }

    // Atomically search for an incomplete tag and assign it the current
    // user
    await this.tagModel.db.transaction(async (): Promise<void> => {
      const searchResult = await this.tagModel.aggregate([
        // Only search on tags that are enabled for the current study
        { $match: { enabled: true, study: study._id.toString() } },
        // Grab tags that are unassigned (user field doesn't exist) or have been completed by the user
        { $match: { $or: [{ user: { $exists: false } }, { user: { $eq: user } }] } },
        // Group by the entrys and expand tags
        { $group: { _id: { entry: '$entry' }, tag: { $push: '$$ROOT' } } },
        // Now filter where user does not show up in the list of tags
        { $match: { 'tag.user': { $ne: user } } },
        // Unwind the tags
        { $unwind: '$tag' },
        // Sort by order
        { $sort: { 'tag.order': 1 } },
        // Limit to a single tag
        { $limit: 1 }
      ]);

      // No result found
      if (searchResult.length == 0) {
        return;
      }

      // Otherwise mark the tag as assigned
      await this.tagModel.findOneAndUpdate({ _id: searchResult[0].tag._id }, { $set: { user } });
    });

    // At this point, if a tag was found, it will be assigned to the user
    return this.getIncomplete(study, user);
  }

  /** Store the data and mark the tag as complete */
  async complete(tag: Tag, data: any): Promise<void> {
    // If the tag is already complete, it cannot be saved again
    if (tag.complete) {
      throw new BadRequestException(`Cannot re-save tag data`);
    }

    // Validate that the tag actually matches the study schema
    const valid = await this.studyService.validateData(tag.study, data);
    if (!valid) {
      throw new BadRequestException(`Tag data does not match study schema`);
    }

    // Save the tag information and mark the tag as complete
    await this.tagModel.findOneAndUpdate({ _id: tag._id }, { $set: { data, complete: true } });
  }

  async setEnabled(study: Study, entry: Entry, enabled: boolean): Promise<void> {
    const existingTag = await this.tagModel.findOne({ _id: entry._id });
    if (existingTag) {
      await this.tagModel.updateMany({ entry: entry._id, study: study._id }, { $set: { enabled: enabled } });
    } else {
      for (let order = 0; order < study.tagsPerEntry; order++) {
        await this.tagModel.create({
          entry: entry._id,
          study: study._id,
          complete: false,
          order,
          enabled: true
        });
      }
    }
  }

  private async getIncomplete(study: Study, user: string): Promise<Tag | null> {
    return this.tagModel.findOne({ study: study._id, user, complete: false, enabled: true });
  }

  private async removeByStudy(study: Study): Promise<void> {
    await this.tagModel.deleteMany({ study: study._id });
  }
}
