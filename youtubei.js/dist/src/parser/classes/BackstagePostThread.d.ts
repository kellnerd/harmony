import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class BackstagePostThread extends YTNode {
    static type: string;
    post: YTNode;
    constructor(data: RawNode);
}
