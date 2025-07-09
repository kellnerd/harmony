import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Menu from './menus/Menu.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class PlaylistVideo extends YTNode {
    static type: string;
    id: string;
    index: Text;
    title: Text;
    author: Author;
    thumbnails: Thumbnail[];
    thumbnail_overlays: ObservedArray<YTNode>;
    set_video_id: string | undefined;
    endpoint: NavigationEndpoint;
    is_playable: boolean;
    menu: Menu | null;
    upcoming?: Date;
    video_info: Text;
    accessibility_label?: string;
    style?: string;
    duration: {
        text: string;
        seconds: number;
    };
    constructor(data: RawNode);
    get is_live(): boolean;
    get is_upcoming(): boolean;
}
