import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class MusicSideAlignedItem extends YTNode {
    static type: string;
    start_items?: ObservedArray<YTNode>;
    end_items?: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
