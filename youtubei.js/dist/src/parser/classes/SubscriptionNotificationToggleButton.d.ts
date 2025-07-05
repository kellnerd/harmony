import { type SuperParsedResult, YTNode } from '../helpers.js';
export default class SubscriptionNotificationToggleButton extends YTNode {
    static type: string;
    states: {
        id: string;
        next_id: string;
        state: SuperParsedResult<YTNode>;
    };
    current_state_id: string;
    target_id: string;
    constructor(data: any);
}
