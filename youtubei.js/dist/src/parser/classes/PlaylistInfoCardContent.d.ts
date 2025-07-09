import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class PlaylistInfoCardContent extends YTNode {
    static type: string;
    title: Text;
    thumbnails: Thumbnail[];
    video_count: Text;
    channel_name: Text;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
