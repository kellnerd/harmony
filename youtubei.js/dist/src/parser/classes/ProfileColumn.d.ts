import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class ProfileColumn extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
