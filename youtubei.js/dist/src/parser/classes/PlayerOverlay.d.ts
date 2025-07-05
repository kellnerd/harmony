import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import DecoratedPlayerBar from './DecoratedPlayerBar.js';
import PlayerOverlayAutoplay from './PlayerOverlayAutoplay.js';
import PlayerOverlayVideoDetails from './PlayerOverlayVideoDetails.js';
import WatchNextEndScreen from './WatchNextEndScreen.js';
import Menu from './menus/Menu.js';
export default class PlayerOverlay extends YTNode {
    static type: string;
    end_screen: WatchNextEndScreen | null;
    autoplay: PlayerOverlayAutoplay | null;
    share_button: Button | null;
    add_to_menu: Menu | null;
    fullscreen_engagement: YTNode | null;
    actions: ObservedArray<YTNode>;
    browser_media_session: YTNode | null;
    decorated_player_bar: DecoratedPlayerBar | null;
    video_details: PlayerOverlayVideoDetails | null;
    constructor(data: RawNode);
}
