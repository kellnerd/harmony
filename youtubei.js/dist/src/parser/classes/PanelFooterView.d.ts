import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ButtonView from './ButtonView.js';
export default class PanelFooterView extends YTNode {
    static type: string;
    primary_button: ButtonView | null;
    secondary_button: ButtonView | null;
    should_hide_divider: boolean;
    constructor(data: RawNode);
}
