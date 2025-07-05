import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class RichSection extends YTNode {
    static type: string;
    content: YTNode;
    full_bleed: boolean;
    target_id?: string;
    constructor(data: RawNode);
}
