import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class CompactStation extends YTNode {
    static type: string;
    title: Text;
    description: Text;
    video_count: Text;
    endpoint: NavigationEndpoint;
    thumbnail: Thumbnail[];
    constructor(data: RawNode);
}
