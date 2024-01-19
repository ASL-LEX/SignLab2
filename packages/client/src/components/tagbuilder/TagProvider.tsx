import { Button } from '@mui/material';
import { Layout, JsonSchema, JsonSchema7 } from '@jsonforms/core';

export interface ProviderButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  name: string;
};

/** How the providers appear, as a button */
export const ProviderButton: React.FC<ProviderButtonProps> = ({ onClick, icon, name }) => {
  return <Button variant="contained" startIcon={icon} onClick={onClick}>{name}</Button>
};

/**
 * Represents how to construct a field of a tag. Used both for building the
 * tag field form as well as for how to generate the final data and ui
 * schema for the given field.
 */
export interface TagField {
  /** Data schema for the generating the tag field form */
  dataSchema: JsonSchema;
  /** UI schema for generating the tag field form */
  uiSchema: Layout;
  /** The kind of field this is */
  fieldKind: string;
  /** How to generate the data schema snippet for the final tag schema */
  produceDataSchema: (data: any) => any;
  /** How to generate the ui schema snippet for the final tag schema */
  produceUISchema: (data: any) => any;
}

/** Helper function to make the JSON form for the tag field form */
export const produceJSONForm = (additionaProperties: { [property: string]: JsonSchema7 }, additionalUISchema: any[], additionalRequired: string[]): { dataSchema: JsonSchema, uiSchema: Layout } => {
  return {
    dataSchema: {
      type: 'object',
      properties: {
        fieldName: { type: 'string' },
        description: { type: 'string' },
        ...additionaProperties,
        required: { type: 'boolean' }
      },
      required: ['fieldName', 'description', ...additionalRequired]
    },
    uiSchema: {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/fieldName'
        },
        {
          type: 'Control',
          scope: '#/properties/description'
        },
        ...additionalUISchema,
        {
          type: 'Control',
          scope: '#/properties/required'
        }
      ]
    }
  };
};

/** How all tag field providers should be structured */
export interface TagFieldProviderProps {
  handleClick: (tagField: TagField) => void;
};

/** Representation of the final schema for a tag field */
export interface TagFieldFragmentSchema {
  dataSchema: { [property: string]: JsonSchema7 };
  uiSchema: any[];
  required: string | null;
};
