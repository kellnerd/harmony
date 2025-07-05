import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class OpenPopupAction extends YTNode {
    static type: string;
    popup: YTNode;
    popup_type: string;
    constructor(data: RawNode);
}
