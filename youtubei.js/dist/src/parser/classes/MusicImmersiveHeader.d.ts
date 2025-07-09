import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import MusicThumbnail from './MusicThumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscribeButton from './SubscribeButton.js';
import ToggleButton from './ToggleButton.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
export default class MusicImmersiveHeader extends YTNode {
    static type: string;
    title: Text;
    menu: Menu | null;
    more_button: ToggleButton | null;
    play_button: Button | null;
    share_endpoint?: NavigationEndpoint;
    start_radio_button: Button | null;
    subscription_button: SubscribeButton | null;
    description: Text;
    thumbnail: MusicThumbnail | null;
    constructor(data: RawNode);
}
