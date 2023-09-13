import { JsonSchema, Layout } from '@jsonforms/core';

/*
 * Different kind of tag fields that are supported
 */
export enum TagFieldType {
  AslLex,
  AutoComplete,
  BooleanOption,
  EmbeddedVideoOption,
  FreeText,
  Numeric,
  Slider,
  VideoRecord
}

export abstract class TagField {
  kind: TagFieldType;
  kindDisplay: string;
  name = '';
  isValid = false;
  data: any = {};
  type: string;

  constructor(kind: TagFieldType, kindDisplay: string, type: string) {
    this.kind = kind;
    this.kindDisplay = kindDisplay;
    this.type = type;
  }
  //in TagFieldComponent we need to set data on json form change
  setData(data: any) {
    this.data = data;
  }

  getFieldName(): string {
    return this.data.fieldName || '';
  }

  isRequired(): boolean {
    return this.data.required || false;
  }

  getDescription(): string {
    return this.data.shortDescription || '';
  }

  async getDataSchema(): Promise<JsonSchema> {
    const properties = await this.getFieldSpecificProperties();
    return {
      type: 'object',
      properties: {
        fieldName: {
          type: 'string'
        },
        shortDescription: {
          type: 'string'
        },
        ...properties,
        required: {
          type: 'boolean'
        }
      },
      required: ['fieldName', 'shortDescription', ...this.getRequiredFieldProperties()]
    };
  }

  getUISchema(): Layout {
    return {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/fieldName'
        },
        {
          type: 'Control',
          scope: '#/properties/shortDescription'
        },
        ...this.getFieldSpecificUiSchema(),
        {
          type: 'Control',
          scope: '#/properties/required'
        }
      ]
    };
  }

  protected getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    return Promise.resolve({});
  }

  protected getRequiredFieldProperties(): string[] {
    return [];
  }

  protected getFieldSpecificUiSchema(): any[] {
    return [];
  }

  asDataProperty(): JsonSchema {
    return {
      [this.getFieldName()]: {
        type: this.type,
        description: this.getDescription()
      }
    };
  }

  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          showUnfocusedDescription: true
        }
      }
    ];
  }
}

/*
 * Now we move on to actual custom fields
 */
export class AslLexField extends TagField {
  constructor() {
    super(TagFieldType.AslLex, 'ASL-LEX Sign', 'string');
  }

  //option for custom labels
  protected getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    return Promise.resolve({
      allowCustomLabels: {
        type: 'boolean'
      }
    });
  }

  //reflect optional custom labels in UI
  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/allowCustomLabels'
      }
    ];
  }

  //overried this method to properly display ASL-LEX video options
  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          customType: 'asl-lex',
          allowCustomLabels: this.data.allowCustomLabels,
          showUnfocusedDescription: true
        }
      }
    ];
  }
}

export class AutoCompleteField extends TagField {
  constructor() {
    super(TagFieldType.AutoComplete, 'AutoComplete', 'string');
  }

  /**
   * The autocomplete field needs a list of options as a data field which
   * will later become the enum values in the tag field.
   */
  protected getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    return Promise.resolve({
      userOptions: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    });
  }

  //reflect optional custom labels in UI
  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/userOptions',
        options: {
          customType: 'file-list'
        }
      }
    ];
  }

  asDataProperty(): JsonSchema {
    return {
      [this.getFieldName()]: {
        type: this.type,
        description: this.getDescription(),
        enum: [...this.data.userOptions]
      }
    };
  }

  protected getRequiredFieldProperties(): string[] {
    return ['userOptions'];
  }
}

export class BooleanField extends TagField {
  constructor() {
    super(TagFieldType.BooleanOption, 'Boolean Option', 'boolean');
  }
}

export class EmbeddedVideoOption extends TagField {
  constructor() {
    super(TagFieldType.EmbeddedVideoOption, 'Video Option', 'string');
  }

  /*
   * Provides options to allow users to select a custom input and the format
   * of the video options
   */
  protected getFieldSpecificProperties(): Promise<{ [property: string]: JsonSchema }> {
    return Promise.resolve({
      allowCustomLabels: {
        type: 'boolean'
      },
      userVideoParameters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            videoURL: {
              type: 'string'
            },
            code: {
              type: 'string'
            },
            searchTerm: {
              type: 'string'
            }
          },
          required: ['videoURL', 'code', 'searchTerm']
        }
      }
    });
  }

  protected getFieldSpecificUiSchema(): any[] {
    return [
      { type: 'Control', scope: '#/properties/allowCustomLabels' },
      {
        type: 'Control',
        scope: '#/properties/userVideoParameters',
        options: {
          customType: 'video-option-upload'
        }
      }
    ];
  }

  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          customType: 'video-options',
          allowCustomLabels: this.data.allowCustomLabels,
          userVideoParameters: this.data.userVideoParameters,
          showUnfocusedDescription: true
        }
      }
    ];
  }

  protected getRequiredFieldProperties(): string[] {
    return ['userVideoParameters'];
  }
}

export class FreeTextField extends TagField {
  constructor() {
    super(TagFieldType.FreeText, 'Free Text', 'string');
  }
}

export class NumericField extends TagField {
  constructor() {
    super(TagFieldType.Numeric, 'Numeric', 'number');
  }

  //there are optional fields for min and max values
  getFieldSpecificProperties(): Promise<{ [property: string]: JsonSchema }> {
    return Promise.resolve({
      minimum: {
        type: 'number'
      },
      maximum: {
        type: 'number'
      }
    });
  }

  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/minimum'
      },
      {
        type: 'Control',
        scope: '#/properties/maximum'
      }
    ];
  }

  asDataProperty(): JsonSchema {
    const schema: JsonSchema = {
      type: 'number',
      description: this.getDescription()
    };

    if (this.data.minimum) {
      schema.minimum = this.data.minimum;
    }

    if (this.data.maximum) {
      schema.maximum = this.data.maximum;
    }

    return {
      [this.getFieldName()]: schema
    };
  }
}

export class SliderField extends TagField {
  constructor() {
    super(TagFieldType.Slider, 'Slider', 'number');
  }

  // slider field required minimum and maximum value
  protected getFieldSpecificProperties(): Promise<{ [property: string]: JsonSchema }> {
    return Promise.resolve({
      minimum: {
        type: 'number'
      },
      maximum: {
        type: 'number'
      },
      stepSize: {
        type: 'number',
        description: 'The step size of the slider'
      }
    });
  }

  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/minimum'
      },
      {
        type: 'Control',
        scope: '/properties/maximum'
      },
      {
        type: 'Control',
        scope: '#/properties/stepSize'
      }
    ];
  }

  protected getRequiredFieldProperties(): string[] {
    return ['minimum', 'maximum'];
  }

  asDataProperty(): JsonSchema {
    return {
      [this.getFieldName()]: {
        type: 'number',
        description: this.getDescription(),
        minimum: this.data.minimum,
        maximum: this.data.maximum,
        multipleOf: this.data.stepSize,
        default: this.data.minimum
      }
    };
  }

  asUIProperty(): any[] {
    return [
      {
        type: 'Control',
        scope: `#/properties/${this.getFieldName()}`,
        options: {
          slider: true,
          showUnfocusedDescription: true
        }
      }
    ];
  }
}
/* 
export class VideoRecordField extends TagField {
  protected hasDatasets: boolean;
  protected datasets: Observable<Dataset[]>;

  constructor(private datasetService: DatasetService) {
    super(TagFieldType.VideoRecord, 'Video Record', 'string');
    this.datasets = datasetService.datasets;
    this.hasDatasets = datasetService.datasets ? true : false;
  }

  getUISchema(): Layout {
    if (this.hasDatasets) {
      return super.getUISchema();
    }

    //no datasets, cannot render video record field
    return {
      type: 'Label',
      text: 'No datasets to save into, make a dataset before adding a video record field'
    } as any;
  }

  async getFieldSpecificProperties(): Promise<{
    [property: string]: JsonSchema;
  }> {
    this.datasets = await firstValueFrom(this.datasetService.datasets);
    const options = this.datasets.map((dataset: any) => {
      return {
        const: dataset.name,
        title: dataset.name
      };
    });
    this.hasDatasets = options.length > 0;

    if (!this.hasDatasets) {
      return {
        alwaysError: {
          type: 'number',
          default: 'BAD'
        }
      };
    }

    return {
      dataset: {
        type: 'string',
        oneOf: options,
        description: 'The dataset to save the videos into'
      },
      minimumRequired: {
        type: 'number',
        description: 'The minimum number of videos the user needs to record, (defaults to 1)'
      },
      maximumOptional: {
        type: 'number',
        description: 'The maximum number of videos the user can record (including required, defaults to 1)'
      }
    };
  }

  protected getFieldSpecificUiSchema(): any[] {
    return [
      {
        type: 'Control',
        scope: '#/properties/dataset'
      },
      {
        type: 'Control',
        scope: '#/properties/minimumRequired',
        options: {
          showUnfocusedDescription: true
        }
      },
      {
        type: 'Control',
        scope: '#/properties/maximumOptional',
        options: {
          showUnfocusedDescription: true
        }
      }
    ];
  }

  protected getRequiredFieldProperties(): string[] {
    return ['dataset'];
  }

  asDataProperty(): JsonSchema {
    return {
      [this.getFieldName()]: {
        type: 'array',
        description: this.getDescription(),
        items: {
          type: 'string'
        },
        minItems: this.data.minimumRequired || 1
      }
    };
  }

  asUIProperty(): any[] {
    const dataset = this.datasets.find((dataset: any) => dataset.name === this.data.dataset);
    console.log(dataset);
    return [
      {
        type: 'Control',
        scope: `#properties/${this.getFieldName()}`,
        options: {
          customType: 'video',
          dataset: dataset?.id,
          minimumRequired: this.data.minimumRequired || 1,
          maximumOptional: this.data.maximumOptional || 1,
          showUnfocusedDescription: true
        }
      }
    ];
  }
} */
