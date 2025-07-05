import { Parser } from '../../index.js';
import { YTNode } from '../../helpers.js';
class ReplayChatItemAction extends YTNode {
    constructor(data) {
        super();
        this.actions = Parser.parseArray(data.actions?.map((action) => {
            delete action.clickTrackingParams;
            return action;
        }));
        this.video_offset_time_msec = data.videoOffsetTimeMsec;
    }
}
ReplayChatItemAction.type = 'ReplayChatItemAction';
export default ReplayChatItemAction;
//# sourceMappingURL=ReplayChatItemAction.js.map