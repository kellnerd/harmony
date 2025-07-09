import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class SharePanelHeader extends YTNode {
    static type: string;
    title: YTNode;
    constructor(data: RawNode);
}
