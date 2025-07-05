import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class RichItem extends YTNode {
    static type: string;
    content: YTNode;
    constructor(data: RawNode);
}
