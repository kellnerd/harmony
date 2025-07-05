import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class NotificationAction extends YTNode {
    constructor(data) {
        super();
        this.response_text = new Text(data.responseText);
    }
}
NotificationAction.type = 'NotificationAction';
export default NotificationAction;
//# sourceMappingURL=NotificationAction.js.map