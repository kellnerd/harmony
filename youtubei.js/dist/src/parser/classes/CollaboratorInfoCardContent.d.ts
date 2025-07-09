import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class CollaboratorInfoCardContent extends YTNode {
    static type: string;
    channel_avatar: Thumbnail[];
    custom_text: Text;
    channel_name: Text;
    subscriber_count: Text;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
