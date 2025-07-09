import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
class LiveChatDialog extends YTNode {
    constructor(data) {
        super();
        this.confirm_button = Parser.parseItem(data.confirmButton, Button);
        this.dialog_messages = data.dialogMessages.map((el) => new Text(el));
    }
}
LiveChatDialog.type = 'LiveChatDialog';
export default LiveChatDialog;
//# sourceMappingURL=LiveChatDialog.js.map