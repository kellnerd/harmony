import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import PanelFooterView from './PanelFooterView.js';
export default class FormFooterView extends YTNode {
    static type: string;
    panel_footer: PanelFooterView | null;
    form_id: string;
    container_type: string;
    constructor(data: RawNode);
}
