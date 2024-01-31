/**
 * A field transformer handles converting and operating on fields of a tag.
 * It handles adding in additional information, update intermediate data,
 * and ensuring that the data meets any additional formatting requirements.
 */
export interface FieldTransformer {
  transformField(field: any): Promise<any>;
};

/**
 * Tests to see if a given field should be transformed. Each `FieldTransformer`
 * has a cooresponding `FieldTransformerTest` that determines if the field
 * should be transformed.
 *
 * The rank is used to determine if one transformer should be used over another.
 * The larger the rank, the higher the priority.
 */
export type FieldTransformerTest = (field: any) => [boolean, number];
