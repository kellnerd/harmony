import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class GridMix extends YTNode {
    static type: string;
    id: string;
    title: Text;
    author: Text | null;
    thumbnails: Thumbnail[];
    video_count: Text;
    video_count_short: Text;
    endpoint: NavigationEndpoint;
    secondary_endpoint: NavigationEndpoint;
    thumbnail_overlays: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
