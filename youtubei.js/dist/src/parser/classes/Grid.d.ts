import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class Grid extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    is_collapsible?: boolean;
    visible_row_count?: string;
    target_id?: string;
    continuation: string | null;
    header?: YTNode;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
