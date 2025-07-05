import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
import Button from './Button.js';
import Menu from './menus/Menu.js';
import InfoPanelContainer from './InfoPanelContainer.js';
import LikeButton from './LikeButton.js';
import ReelPlayerHeader from './ReelPlayerHeader.js';
import PivotButton from './PivotButton.js';
import SubscribeButton from './SubscribeButton.js';
export default class ReelPlayerOverlay extends YTNode {
    static type: string;
    like_button: LikeButton | null;
    reel_player_header_supported_renderers: ReelPlayerHeader | null;
    menu: Menu | null;
    next_item_button: Button | null;
    prev_item_button: Button | null;
    subscribe_button_renderer: Button | SubscribeButton | null;
    style: string;
    view_comments_button: Button | null;
    share_button: Button | null;
    pivot_button: PivotButton | null;
    info_panel: InfoPanelContainer | null;
    constructor(data: RawNode);
}
