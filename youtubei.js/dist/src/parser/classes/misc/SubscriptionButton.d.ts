import type { RawNode } from '../../index.js';
import Text from './Text.js';
export default class SubscriptionButton {
    static type: string;
    text: Text;
    subscribed: boolean;
    subscription_type?: 'FREE' | 'PAID' | 'UNAVAILABLE';
    constructor(data: RawNode);
}
