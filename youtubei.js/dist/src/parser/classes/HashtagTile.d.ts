import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { Thumbnail } from '../misc.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
export default class HashtagTile extends YTNode {
    static type: string;
    hashtag: Text;
    hashtag_info_text: Text;
    hashtag_thumbnail: Thumbnail[];
    endpoint: NavigationEndpoint;
    hashtag_background_color: number;
    hashtag_video_count: Text;
    hashtag_channel_count: Text;
    constructor(data: RawNode);
}
