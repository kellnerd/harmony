import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class HorizontalList extends YTNode {
    static type: string;
    visible_item_count: string;
    items: ObservedArray<YTNode>;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
