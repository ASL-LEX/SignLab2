## To-Do for Creating New Study 

### Imitating Angular Behavior and UI 

1. Creating tag fields
   * TagFieldType.AslLex -> ASL-LEX Sign
   * TagFieldType.Autocomplete -> Categorical
   * TagFieldType.BooleanOption -> True/False Option
   * TagFieldType.EmbdeddedVideoOption -> Video Option
   * TagFieldType.FreeText -> Free Text
   * TagFieldType.Numeric -> Numeric
   * TagFieldType.Slider -> Slider
   * TagFieldType.VideoRecord -> Record Video

2. Creating renderers for the tags
   * ...angularMaterialRenderers -> change it to reactMaterialRenderers
   * tester: aslLexSignBankControlRendererTester, renderer: AslLexSignBankField
   * tester: fileListControlRendererTester, renderer: FileListField
   * tester: videoOptionUploadRendererTester, renderer: VideoOptionUpload
   * tester: userVideoOptionRendererTester, renderer: UserVideoOption
   * tester: videoFieldTester, renderer: VideoFieldComponent
   * tester: oneOfFieldTester, renderer: OneOfField
  
3. Tag Fields: TagField[] -> fields that will be part of the tag
4. Produce JSON Form 
5. Mui Stepper
   * Step next or submit
6. Stepper Logic
7. Dialog to preview added tags
8. Add a field to the tag
9. Remove a field from the tag
10. Boolean that's updated when study is created
11. Make a new study based on a form data
    * Required data filled out
    * Study name is unique
    * There is at least one field
    * Make sure each field is complete and has unique name
    * Save the new study with an associated project id

















