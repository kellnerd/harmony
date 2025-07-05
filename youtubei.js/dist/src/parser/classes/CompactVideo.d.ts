import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Menu from './menus/Menu.js';
import MetadataBadge from './MetadataBadge.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class CompactVideo extends YTNode {
    static type: string;
    video_id: string;
    thumbnails: Thumbnail[];
    rich_thumbnail?: YTNode;
    title: Text;
    author: Author;
    view_count?: Text;
    short_view_count?: Text;
    short_byline_text?: Text;
    long_byline_text?: Text;
    published?: Text;
    badges: MetadataBadge[];
    thumbnail_overlays: ObservedArray<YTNode>;
    endpoint?: NavigationEndpoint;
    menu: Menu | null;
    length_text?: Text;
    is_watched: boolean;
    service_endpoints?: NavigationEndpoint[];
    service_endpoint?: NavigationEndpoint;
    style?: 'COMPACT_VIDEO_STYLE_TYPE_UNKNOWN' | 'COMPACT_VIDEO_STYLE_TYPE_NORMAL' | 'COMPACT_VIDEO_STYLE_TYPE_PROMINENT_THUMBNAIL' | 'COMPACT_VIDEO_STYLE_TYPE_HERO';
    constructor(data: RawNode);
    /**
     * @deprecated Use {@linkcode video_id} instead.
     */
    get id(): string;
    get duration(): {
        text: string | undefined;
        seconds: number;
    };
    get best_thumbnail(): Thumbnail;
    get is_fundraiser(): boolean;
    get is_live(): boolean;
    get is_new(): boolean;
    get is_premiere(): boolean;
}
