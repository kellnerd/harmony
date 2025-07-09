import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscribeButton from './SubscribeButton.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class TopicChannelDetails extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.avatar = Thumbnail.fromResponse(data.thumbnail ?? data.avatar);
        this.subtitle = new Text(data.subtitle);
        this.subscribe_button = Parser.parseItem(data.subscribeButton, SubscribeButton);
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
    }
}
TopicChannelDetails.type = 'TopicChannelDetails';
export default TopicChannelDetails;
//# sourceMappingURL=TopicChannelDetails.js.map