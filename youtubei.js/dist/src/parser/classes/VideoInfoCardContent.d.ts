import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class VideoInfoCardContent extends YTNode {
    static type: string;
    title: Text;
    channel_name: Text;
    view_count: Text;
    video_thumbnails: Thumbnail[];
    duration: Text;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
