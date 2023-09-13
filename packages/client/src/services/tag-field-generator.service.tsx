import { TagFieldType, AslLexField, AutoCompleteField, BooleanField, EmbeddedVideoOption, FreeTextField, NumericField, SliderField } from '../models/TagField';

export const TagFieldGeneratorService = (tagFieldType: TagFieldType) => {
  /**
   * Factory method to get the field definition associated with the given
   * field type.
   */
  switch (tagFieldType) {
    case TagFieldType.AslLex:
      return new AslLexField();
    case TagFieldType.AutoComplete:
      return new AutoCompleteField();
    case TagFieldType.BooleanOption:
      return new BooleanField();
    case TagFieldType.EmbeddedVideoOption:
      return new EmbeddedVideoOption();
    case TagFieldType.FreeText:
      return new FreeTextField();
    case TagFieldType.Numeric:
      return new NumericField();
    case TagFieldType.Slider:
      return new SliderField();
    default:
      return new FreeTextField();
  }
};
