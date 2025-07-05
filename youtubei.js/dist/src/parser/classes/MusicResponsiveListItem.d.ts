import { YTNode } from '../helpers.js';
import type { ObservedArray } from '../helpers.js';
import type { RawNode } from '../index.js';
import MusicItemThumbnailOverlay from './MusicItemThumbnailOverlay.js';
import MusicResponsiveListItemFixedColumn from './MusicResponsiveListItemFixedColumn.js';
import MusicResponsiveListItemFlexColumn from './MusicResponsiveListItemFlexColumn.js';
import MusicThumbnail from './MusicThumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
export default class MusicResponsiveListItem extends YTNode {
    #private;
    static type: string;
    flex_columns: ObservedArray<MusicResponsiveListItemFlexColumn>;
    fixed_columns: ObservedArray<MusicResponsiveListItemFixedColumn>;
    endpoint?: NavigationEndpoint;
    item_type: 'album' | 'playlist' | 'artist' | 'library_artist' | 'non_music_track' | 'video' | 'song' | 'endpoint' | 'unknown' | 'podcast_show' | undefined;
    index?: Text;
    thumbnail?: MusicThumbnail | null;
    badges: ObservedArray<YTNode> | undefined;
    menu?: Menu | null;
    overlay?: MusicItemThumbnailOverlay | null;
    id?: string;
    title?: string;
    duration?: {
        text: string;
        seconds: number;
    };
    album?: {
        id?: string;
        name: string;
        endpoint?: NavigationEndpoint;
    };
    artists?: {
        name: string;
        channel_id?: string;
        endpoint?: NavigationEndpoint;
    }[];
    views?: string;
    authors?: {
        name: string;
        channel_id?: string;
        endpoint?: NavigationEndpoint;
    }[];
    name?: string;
    subtitle?: Text;
    subscribers?: string;
    song_count?: string;
    author?: {
        name: string;
        channel_id?: string;
        endpoint?: NavigationEndpoint;
    };
    item_count?: string;
    year?: string;
    constructor(data: RawNode);
    get thumbnails(): import("./misc/Thumbnail.js").default[];
}
