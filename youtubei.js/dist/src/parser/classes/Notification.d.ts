import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class Notification extends YTNode {
    static type: string;
    thumbnails: Thumbnail[];
    video_thumbnails: Thumbnail[];
    short_message: Text;
    sent_time: Text;
    notification_id: string;
    endpoint: NavigationEndpoint;
    record_click_endpoint: NavigationEndpoint;
    menu: YTNode;
    read: boolean;
    constructor(data: RawNode);
}
