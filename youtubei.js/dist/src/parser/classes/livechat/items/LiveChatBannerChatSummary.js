import { YTNode } from '../../../helpers.js';
import { Parser } from '../../../index.js';
import Text from '../../misc/Text.js';
import ToggleButtonView from '../../ToggleButtonView.js';
class LiveChatBannerChatSummary extends YTNode {
    constructor(data) {
        super();
        this.id = data.liveChatSummaryId;
        this.chat_summary = new Text(data.chatSummary);
        this.icon_type = data.icon.iconType;
        this.like_feedback_button = Parser.parseItem(data.likeFeedbackButton, ToggleButtonView);
        this.dislike_feedback_button = Parser.parseItem(data.dislikeFeedbackButton, ToggleButtonView);
    }
}
LiveChatBannerChatSummary.type = 'LiveChatBannerChatSummary';
export default LiveChatBannerChatSummary;
//# sourceMappingURL=LiveChatBannerChatSummary.js.map