import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE } from '../../../types/TagColumnView';
import { materialSliderControlTester } from '@jsonforms/material-renderers';

/** Visualize basic text data in a grid view */
export const SliderGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return data;
}

export const sliderTest: TagViewTest = (uischema, schema, context) => {
  if (materialSliderControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 2;
  }
  return NOT_APPLICABLE;
}
