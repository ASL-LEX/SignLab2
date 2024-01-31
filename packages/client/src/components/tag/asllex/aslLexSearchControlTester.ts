import { rankWith } from '@jsonforms/core';

export default rankWith(
  5,
  (uischema, _schema, _rootSchema) => {
    return (
      uischema.options != undefined &&
      uischema.options.customType != undefined &&
      uischema.options.customType == 'asl-lex'
    );
  }
);