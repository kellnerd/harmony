import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export type DisplayProperties = {
    isMultiline: boolean;
    disableNewLines: boolean;
};
export type ContentProperties = {
    labelText: string;
    placeholderText: string;
    maxCharacterCount: number;
};
export type InitialState = {
    isFocused: boolean;
};
export type FormFieldMetadata = {
    formId: string;
    fieldId: string;
};
export default class TextFieldView extends YTNode {
    static type: string;
    display_properties?: DisplayProperties;
    content_properties?: ContentProperties;
    initial_state?: InitialState;
    form_field_metadata?: FormFieldMetadata;
    constructor(data: RawNode);
}
