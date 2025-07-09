import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class TopbarMenuButton extends YTNode {
    static type: string;
    icon_type?: string;
    menu_renderer: YTNode | null;
    target_id: string;
    constructor(data: RawNode);
}
