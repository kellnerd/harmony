import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ButtonView from './ButtonView.js';
export default class ToggleButtonView extends YTNode {
    static type: string;
    default_button: ButtonView | null;
    toggled_button: ButtonView | null;
    is_toggling_disabled: boolean;
    identifier?: string;
    is_toggled?: boolean;
    constructor(data: RawNode);
}
