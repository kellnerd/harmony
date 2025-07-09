import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class StructuredDescriptionPlaylistLockup extends YTNode {
    static type: string;
    thumbnail: Thumbnail[];
    title: Text;
    short_byline_text: Text;
    video_count_short_text: Text;
    endpoint: NavigationEndpoint;
    thumbnail_width: number;
    aspect_ratio: number;
    max_lines_title: number;
    max_lines_short_byline_text: number;
    overlay_position: string;
    constructor(data: RawNode);
}
