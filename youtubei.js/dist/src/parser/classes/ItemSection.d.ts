import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import ItemSectionHeader from './ItemSectionHeader.js';
import ItemSectionTabbedHeader from './ItemSectionTabbedHeader.js';
import CommentsHeader from './comments/CommentsHeader.js';
import SortFilterHeader from './SortFilterHeader.js';
import FeedFilterChipBar from './FeedFilterChipBar.js';
export default class ItemSection extends YTNode {
    static type: string;
    header: CommentsHeader | ItemSectionHeader | ItemSectionTabbedHeader | SortFilterHeader | FeedFilterChipBar | null;
    contents: ObservedArray<YTNode>;
    target_id?: string;
    continuation?: string;
    constructor(data: RawNode);
}
