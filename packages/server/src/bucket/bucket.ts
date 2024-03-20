export enum BucketObjectAction {
  READ,
  WRITE,
  DELETE
}

export interface Bucket {
  /** Get a signed URL for the given bucket location */
  getSignedUrl(location: string, action: BucketObjectAction, expiration: Date, contentType?: string): Promise<string>;

  /** Delete the object at the given location */
  delete(location: string): Promise<void>;

  /** Move an object between two locations */
  move(originalLocation: string, finalLocation: string): Promise<void>;

  /** Check if an object exists */
  exists(location: string): Promise<boolean>;
}
