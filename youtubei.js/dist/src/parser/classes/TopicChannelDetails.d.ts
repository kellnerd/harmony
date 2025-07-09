import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscribeButton from './SubscribeButton.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class TopicChannelDetails extends YTNode {
    static type: string;
    title: Text;
    avatar: Thumbnail[];
    subtitle: Text;
    subscribe_button: SubscribeButton | null;
    endpoint: NavigationEndpoint;
    constructor(data: RawNode);
}
