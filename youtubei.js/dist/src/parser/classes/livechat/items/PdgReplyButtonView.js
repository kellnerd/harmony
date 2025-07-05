import { YTNode } from '../../../helpers.js';
import { Parser } from '../../../index.js';
import ButtonView from '../../ButtonView.js';
import Text from '../../misc/Text.js';
class PdgReplyButtonView extends YTNode {
    constructor(data) {
        super();
        this.reply_button = Parser.parseItem(data.replyButton, ButtonView);
        this.reply_count_entity_key = data.replyCountEntityKey;
        this.reply_count_placeholder = Text.fromAttributed(data.replyCountPlaceholder);
    }
}
PdgReplyButtonView.type = 'PdgReplyButtonView';
export default PdgReplyButtonView;
//# sourceMappingURL=PdgReplyButtonView.js.map