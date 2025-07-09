import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import SubscriptionNotificationToggleButton from './SubscriptionNotificationToggleButton.js';
import Text from './misc/Text.js';
export default class SubscribeButton extends YTNode {
    static type: string;
    button_text: Text;
    subscribed: boolean;
    enabled: boolean;
    item_type: string;
    channel_id: string;
    show_preferences: boolean;
    subscribed_text?: Text;
    unsubscribed_text?: Text;
    unsubscribe_text?: Text;
    notification_preference_button: SubscriptionNotificationToggleButton | null;
    service_endpoints?: NavigationEndpoint[];
    on_subscribe_endpoints?: NavigationEndpoint[];
    on_unsubscribe_endpoints?: NavigationEndpoint[];
    subscribed_entity_key?: string;
    target_id?: string;
    subscribe_accessibility_label?: string;
    unsubscribe_accessibility_label?: string;
    constructor(data: RawNode);
}
