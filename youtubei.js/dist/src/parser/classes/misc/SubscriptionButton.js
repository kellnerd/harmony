import Text from './Text.js';
class SubscriptionButton {
    constructor(data) {
        this.text = new Text(data.text);
        this.subscribed = data.isSubscribed;
        if ('subscriptionType' in data)
            this.subscription_type = data.subscriptionType;
    }
}
SubscriptionButton.type = 'SubscriptionButton';
export default SubscriptionButton;
//# sourceMappingURL=SubscriptionButton.js.map