import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
/**
 * Not a real renderer but we treat it as one to keep things organized.
 */
class AccountItem extends YTNode {
    constructor(data) {
        super();
        this.account_name = new Text(data.accountName);
        this.account_photo = Thumbnail.fromResponse(data.accountPhoto);
        this.is_selected = !!data.isSelected;
        this.is_disabled = !!data.isDisabled;
        this.has_channel = !!data.hasChannel;
        this.endpoint = new NavigationEndpoint(data.serviceEndpoint);
        this.account_byline = new Text(data.accountByline);
        this.channel_handle = new Text(data.channelHandle);
    }
}
AccountItem.type = 'AccountItem';
export default AccountItem;
//# sourceMappingURL=AccountItem.js.map