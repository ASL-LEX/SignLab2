import { TagColumnViewProps, TagViewTest, NOT_APPLICABLE } from '../../../types/TagColumnView';
import { materialBooleanControlTester } from '@jsonforms/material-renderers';
import { Checkbox } from '@mui/material';

/** Visualize basic text data in a grid view */
export const BooleanGridView: React.FC<TagColumnViewProps> = ({ data }) => {
  return <Checkbox disabled checked={data} />;
}

export const booleanTest: TagViewTest = (uischema, schema, context) => {
  if (materialBooleanControlTester(uischema, schema, context) !== NOT_APPLICABLE) {
    return 1;
  }
  return NOT_APPLICABLE;
}
