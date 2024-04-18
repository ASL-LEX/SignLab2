import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Injectable } from '@nestjs/common';
import { BooleanFieldTransformer, BooleanFieldTransformerTest } from './boolean-transformer';
import { FieldTransformer, FieldTransformerTest, NOT_APPLICABLE } from './field-transformer';
import { VideoFieldTransformer, VideoFieldTransformerTest } from './video-field-transformer';
import { NumericFieldTransformerTest, NumericFieldTransformer } from './numeric-transformer';
import { FreeTextFieldTransformer, FreeTextFieldTransformerTest } from './free-text.transformer';
import { SliderFieldTransformerTest, SliderFieldTransformer } from './slider-transformer';
import { AslLexFieldTransformer, AslLexFieldTransformerTest } from './asl-lex-transformer';

type FieldTransformerOptions = { tester: FieldTransformerTest; transformer: FieldTransformer };

@Injectable()
export class FieldTransformerFactory {
  private readonly transformers: FieldTransformerOptions[] = [
    { tester: AslLexFieldTransformerTest, transformer: this.aslLexFieldTransformer },
    { tester: BooleanFieldTransformerTest, transformer: this.booleanFieldTransformer },
    { tester: FreeTextFieldTransformerTest, transformer: this.freeTextFieldTransformer },
    { tester: NumericFieldTransformerTest, transformer: this.numericFieldTransformer },
    { tester: SliderFieldTransformerTest, transformer: this.sliderFieldTransformer },
    { tester: VideoFieldTransformerTest, transformer: this.videoFieldTransformer }
  ];

  constructor(
    private readonly aslLexFieldTransformer: AslLexFieldTransformer,
    private readonly booleanFieldTransformer: BooleanFieldTransformer,
    private readonly freeTextFieldTransformer: FreeTextFieldTransformer,
    private readonly numericFieldTransformer: NumericFieldTransformer,
    private readonly sliderFieldTransformer: SliderFieldTransformer,
    private readonly videoFieldTransformer: VideoFieldTransformer
  ) {}

  /** Get the transformer for the given field */
  getTransformer(uischema: UISchemaElement, schema: JsonSchema): FieldTransformer | null {
    // Run the testers, discard non-matches, and sort by priority
    const transformers = this.transformers
      .filter(({ tester }) => tester(uischema, schema) !== NOT_APPLICABLE)
      .sort((a, b) => b.tester(uischema, schema) - a.tester(uischema, schema));

    // If there are any matches, return the first one
    if (transformers.length > 0) {
      return transformers[0].transformer;
    }
    return null;
  }
}
