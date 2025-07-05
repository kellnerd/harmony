import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class RelatedChipCloud extends YTNode {
    static type: string;
    content: YTNode;
    constructor(data: RawNode);
}
