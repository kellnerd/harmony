import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class PlayerOverlayAutoplay extends YTNode {
    static type: string;
    title: Text;
    video_id: string;
    video_title: Text;
    short_view_count: Text;
    prefer_immediate_redirect: any;
    count_down_secs_for_fullscreen: any;
    published: Text;
    background: Thumbnail[];
    thumbnail_overlays: ObservedArray<YTNode>;
    author: Author;
    cancel_button: Button | null;
    next_button: Button | null;
    close_button: Button | null;
    constructor(data: RawNode);
}
