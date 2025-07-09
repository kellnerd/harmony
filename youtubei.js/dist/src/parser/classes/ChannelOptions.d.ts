import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ChannelOptions extends YTNode {
    static type: string;
    avatar: Thumbnail[];
    endpoint: NavigationEndpoint;
    name: string;
    links: Text[];
    constructor(data: RawNode);
}
