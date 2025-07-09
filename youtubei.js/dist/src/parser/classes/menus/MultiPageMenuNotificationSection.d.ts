import { type ObservedArray, YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
import ContinuationItem from '../ContinuationItem.js';
import Message from '../Message.js';
import Notification from '../Notification.js';
import Text from '../misc/Text.js';
export default class MultiPageMenuNotificationSection extends YTNode {
    static type: string;
    notification_section_title?: Text;
    items: ObservedArray<Notification | Message | ContinuationItem>;
    constructor(data: RawNode);
    get contents(): ObservedArray<ContinuationItem | Message | Notification>;
}
