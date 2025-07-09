import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import MusicThumbnail from './MusicThumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscribeButton from './SubscribeButton.js';
import ToggleButton from './ToggleButton.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
class MusicImmersiveHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.menu = Parser.parseItem(data.menu, Menu);
        this.more_button = Parser.parseItem(data.moreButton, ToggleButton);
        this.play_button = Parser.parseItem(data.playButton, Button);
        if ('shareEndpoint' in data)
            this.share_endpoint = new NavigationEndpoint(data.shareEndpoint);
        this.start_radio_button = Parser.parseItem(data.startRadioButton, Button);
        this.subscription_button = Parser.parseItem(data.subscriptionButton, SubscribeButton);
        this.description = new Text(data.description);
        this.thumbnail = Parser.parseItem(data.thumbnail, MusicThumbnail);
    }
}
MusicImmersiveHeader.type = 'MusicImmersiveHeader';
export default MusicImmersiveHeader;
//# sourceMappingURL=MusicImmersiveHeader.js.map