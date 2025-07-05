import type { ObservedArray } from '../../helpers.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import MenuNavigationItem from './MenuNavigationItem.js';
import MenuServiceItem from './MenuServiceItem.js';
export default class MenuPopup extends YTNode {
    static type: string;
    items: ObservedArray<MenuNavigationItem | MenuServiceItem>;
    constructor(data: RawNode);
}
