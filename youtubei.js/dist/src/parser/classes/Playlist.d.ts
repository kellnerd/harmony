import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import PlaylistCustomThumbnail from './PlaylistCustomThumbnail.js';
import PlaylistVideoThumbnail from './PlaylistVideoThumbnail.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class Playlist extends YTNode {
    static type: string;
    id: string;
    title: Text;
    author: Text | Author;
    thumbnails: Thumbnail[];
    thumbnail_renderer?: PlaylistVideoThumbnail | PlaylistCustomThumbnail;
    video_count: Text;
    video_count_short: Text;
    first_videos: ObservedArray<YTNode>;
    share_url: string | null;
    menu: YTNode;
    badges: ObservedArray<YTNode>;
    endpoint: NavigationEndpoint;
    thumbnail_overlays: ObservedArray<YTNode>;
    view_playlist?: Text;
    constructor(data: RawNode);
}
