import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import ItemSectionTab from './ItemSectionTab.js';
import Text from './misc/Text.js';
export default class ItemSectionTabbedHeader extends YTNode {
    static type: string;
    title: Text;
    tabs: ObservedArray<ItemSectionTab>;
    end_items?: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
