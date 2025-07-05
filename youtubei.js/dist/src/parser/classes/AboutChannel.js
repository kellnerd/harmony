import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import AboutChannelView from './AboutChannelView.js';
import Button from './Button.js';
class AboutChannel extends YTNode {
    constructor(data) {
        super();
        this.metadata = Parser.parseItem(data.metadata, AboutChannelView);
        this.share_channel = Parser.parseItem(data.shareChannel, Button);
    }
}
AboutChannel.type = 'AboutChannel';
export default AboutChannel;
//# sourceMappingURL=AboutChannel.js.map