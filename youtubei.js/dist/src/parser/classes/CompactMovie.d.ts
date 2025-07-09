import { YTNode, type ObservedArray } from '../helpers.js';
import type { RawNode } from '../index.js';
import Author from './misc/Author.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import Menu from './menus/Menu.js';
export default class CompactMovie extends YTNode {
    static type: string;
    id: string;
    title: Text;
    top_metadata_items: Text;
    thumbnails: Thumbnail[];
    thumbnail_overlays: ObservedArray<YTNode>;
    author: Author;
    duration: {
        text: string;
        seconds: number;
    };
    endpoint: NavigationEndpoint;
    badges: ObservedArray<YTNode>;
    use_vertical_poster: boolean;
    menu: Menu | null;
    constructor(data: RawNode);
}
