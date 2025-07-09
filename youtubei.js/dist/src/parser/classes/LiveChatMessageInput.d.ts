import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
export default class LiveChatMessageInput extends YTNode {
    static type: string;
    author_name: Text;
    author_photo: Thumbnail[];
    send_button: Button | null;
    target_id: string;
    constructor(data: RawNode);
}
