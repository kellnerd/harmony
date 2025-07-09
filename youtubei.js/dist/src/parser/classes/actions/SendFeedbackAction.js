import { YTNode } from '../../helpers.js';
class SendFeedbackAction extends YTNode {
    constructor(data) {
        super();
        this.bucket = data.bucket;
    }
}
SendFeedbackAction.type = 'SendFeedbackAction';
export default SendFeedbackAction;
//# sourceMappingURL=SendFeedbackAction.js.map