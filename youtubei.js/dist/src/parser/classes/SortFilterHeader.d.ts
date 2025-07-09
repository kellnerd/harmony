import { YTNode } from '../helpers.js';
import { YTNodes, type RawNode } from '../index.js';
export default class SortFilterHeader extends YTNode {
    static type: string;
    filter_menu: YTNodes.SortFilterSubMenu | null;
    constructor(data: RawNode);
}
