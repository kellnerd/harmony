import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscribeButton from './SubscribeButton.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class SlimOwner extends YTNode {
    static type: string;
    thumbnail: Thumbnail[];
    title: Text;
    endpoint: NavigationEndpoint;
    subscribe_button: SubscribeButton | null;
    constructor(data: RawNode);
}
