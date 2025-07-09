import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import ExpandableMetadata from './ExpandableMetadata.js';
import MetadataBadge from './MetadataBadge.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class Video extends YTNode {
    static type: string;
    video_id: string;
    title: Text;
    untranslated_title?: Text;
    description_snippet?: Text;
    snippets?: {
        text: Text;
        hover_text: Text;
    }[];
    expandable_metadata: ExpandableMetadata | null;
    additional_metadatas?: Text[];
    thumbnails: Thumbnail[];
    thumbnail_overlays: ObservedArray<YTNode>;
    rich_thumbnail?: YTNode;
    author: Author;
    badges: MetadataBadge[];
    endpoint?: NavigationEndpoint;
    published?: Text;
    view_count?: Text;
    short_view_count?: Text;
    upcoming?: Date;
    length_text?: Text;
    show_action_menu: boolean;
    is_watched: boolean;
    menu: Menu | null;
    byline_text?: Text;
    search_video_result_entity_key?: string;
    service_endpoints?: NavigationEndpoint[];
    service_endpoint?: NavigationEndpoint;
    style?: 'VIDEO_STYLE_TYPE_UNKNOWN' | 'VIDEO_STYLE_TYPE_NORMAL' | 'VIDEO_STYLE_TYPE_POST' | 'VIDEO_STYLE_TYPE_SUB' | 'VIDEO_STYLE_TYPE_LIVE_POST' | 'VIDEO_STYLE_TYPE_FULL_BLEED_ISOLATED' | 'VIDEO_STYLE_TYPE_WITH_EXPANDED_METADATA';
    constructor(data: RawNode);
    /**
     * @deprecated Use {@linkcode video_id} instead.
     */
    get id(): string;
    get description(): string;
    get is_live(): boolean;
    get is_upcoming(): boolean | undefined;
    get is_premiere(): boolean;
    get is_4k(): boolean;
    get has_captions(): boolean;
    get best_thumbnail(): Thumbnail | undefined;
    get duration(): {
        text: string | undefined;
        seconds: number;
    };
}
