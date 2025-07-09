import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class GridPlaylist extends YTNode {
    static type: string;
    id: string;
    title: Text;
    author?: Author;
    badges: ObservedArray<YTNode>;
    endpoint: NavigationEndpoint;
    view_playlist: Text;
    thumbnails: Thumbnail[];
    thumbnail_renderer: YTNode;
    sidebar_thumbnails: Thumbnail[] | null;
    video_count: Text;
    video_count_short: Text;
    constructor(data: RawNode);
}
