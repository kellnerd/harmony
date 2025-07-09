import { YTNode } from '../../helpers.js';
class UpdateSubscribeButtonAction extends YTNode {
    constructor(data) {
        super();
        this.channel_id = data.channelId;
        this.subscribed = data.subscribed;
    }
}
UpdateSubscribeButtonAction.type = 'UpdateSubscribeButtonAction';
export default UpdateSubscribeButtonAction;
//# sourceMappingURL=UpdateSubscribeButtonAction.js.map