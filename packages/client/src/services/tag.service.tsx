import { Tag } from '../dtos/tag.dto';

export class TagService {
  protected currentTag: Tag | null = null;

  getCurrent = () => {
    if (this.currentTag === null) {
      throw new Error('no current tag');
    }
    return this.currentTag;
  };

  hasCurrenttag = () => {
    return this.currentTag !== null;
  };

  clearCurrentTag = () => {
    this.currentTag = null;
  };
}
