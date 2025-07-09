import { YTNode } from '../helpers.js';
class TextFieldView extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'displayProperties')) {
            this.display_properties = {
                isMultiline: !!data.displayProperties.isMultiline,
                disableNewLines: !!data.displayProperties.disableNewLines
            };
        }
        if (Reflect.has(data, 'contentProperties')) {
            this.content_properties = {
                labelText: data.contentProperties.labelText,
                placeholderText: data.contentProperties.placeholderText,
                maxCharacterCount: data.contentProperties.maxCharacterCount
            };
        }
        if (Reflect.has(data, 'initialState')) {
            this.initial_state = {
                isFocused: !!data.initialState.isFocused
            };
        }
        if (Reflect.has(data, 'formFieldMetadata')) {
            this.form_field_metadata = {
                formId: data.formFieldMetadata.formId,
                fieldId: data.formFieldMetadata.fieldId
            };
        }
    }
}
TextFieldView.type = 'TextFieldView';
export default TextFieldView;
//# sourceMappingURL=TextFieldView.js.map