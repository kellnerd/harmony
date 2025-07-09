import { YTNode, type SuperParsedResult } from '../helpers.js';
import { type RawNode } from '../index.js';
import MusicItemThumbnailOverlay from './MusicItemThumbnailOverlay.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class MusicTwoRowItem extends YTNode {
    static type: string;
    title: Text;
    endpoint: NavigationEndpoint;
    id: string | undefined;
    subtitle: Text;
    badges: SuperParsedResult<YTNode> | null;
    item_type: string;
    subscribers?: string;
    item_count?: string | null;
    year?: string;
    views?: string;
    artists?: {
        name: string;
        channel_id: string | undefined;
        endpoint: NavigationEndpoint | undefined;
    }[];
    author?: {
        name: string;
        channel_id: string | undefined;
        endpoint: NavigationEndpoint | undefined;
    };
    thumbnail: Thumbnail[];
    thumbnail_overlay: MusicItemThumbnailOverlay | null;
    menu: Menu | null;
    constructor(data: RawNode);
}
