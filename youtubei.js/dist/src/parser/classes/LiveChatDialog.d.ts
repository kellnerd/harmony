import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
export default class LiveChatDialog extends YTNode {
    static type: string;
    confirm_button: Button | null;
    dialog_messages: Text[];
    constructor(data: RawNode);
}
