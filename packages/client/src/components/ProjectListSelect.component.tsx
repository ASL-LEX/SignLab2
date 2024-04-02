import { ControlProps, rankWith, RankedTester } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

const ProjectListSelect: React.FC<ControlProps> = (props) => {
  return <p>hello world</p>;
};

export const videoFieldTester: RankedTester = rankWith(10, (uischema, _schema, _rootSchema) => {
  return uischema.options != undefined && uischema.options && uischema.options.customType === 'projectList';
});

export default withJsonFormsControlProps(ProjectListSelect);
