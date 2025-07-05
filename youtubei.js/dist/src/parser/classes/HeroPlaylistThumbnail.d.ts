import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Thumbnail from './misc/Thumbnail.js';
export default class HeroPlaylistThumbnail extends YTNode {
    static type: string;
    thumbnails: Thumbnail[];
    on_tap_endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
