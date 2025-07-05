import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class CompactChannel extends YTNode {
    static type: string;
    title: Text;
    channel_id: string;
    thumbnail: Thumbnail[];
    display_name: Text;
    video_count: Text;
    subscriber_count: Text;
    endpoint: NavigationEndpoint;
    tv_banner: Thumbnail[];
    menu: Menu | null;
    constructor(data: RawNode);
}
