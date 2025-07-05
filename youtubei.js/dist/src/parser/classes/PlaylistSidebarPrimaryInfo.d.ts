import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class PlaylistSidebarPrimaryInfo extends YTNode {
    static type: string;
    stats: Text[];
    thumbnail_renderer: YTNode;
    title: Text;
    menu: YTNode;
    endpoint: NavigationEndpoint;
    description: Text;
    constructor(data: RawNode);
}
