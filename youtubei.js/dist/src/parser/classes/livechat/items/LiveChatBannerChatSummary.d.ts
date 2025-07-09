import { YTNode } from '../../../helpers.js';
import { type RawNode } from '../../../index.js';
import Text from '../../misc/Text.js';
import ToggleButtonView from '../../ToggleButtonView.js';
export default class LiveChatBannerChatSummary extends YTNode {
    static type: string;
    id: string;
    chat_summary: Text;
    icon_type: string;
    like_feedback_button: ToggleButtonView | null;
    dislike_feedback_button: ToggleButtonView | null;
    constructor(data: RawNode);
}
