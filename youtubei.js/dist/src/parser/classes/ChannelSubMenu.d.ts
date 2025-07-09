import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class ChannelSubMenu extends YTNode {
    static type: string;
    content_type_sub_menu_items: {
        endpoint: NavigationEndpoint;
        selected: boolean;
        title: string;
    }[];
    sort_setting: YTNode;
    constructor(data: RawNode);
}
