import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class MetadataRowContainer extends YTNode {
    static type: string;
    rows: ObservedArray<YTNode>;
    collapsed_item_count: number;
    constructor(data: RawNode);
}
