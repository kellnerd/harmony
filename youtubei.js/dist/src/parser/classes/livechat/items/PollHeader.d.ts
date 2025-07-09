import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import Button from '../../Button.js';
import Text from '../../misc/Text.js';
import Thumbnail from '../../misc/Thumbnail.js';
export default class PollHeader extends YTNode {
    static type: string;
    poll_question: Text;
    thumbnails: Thumbnail[];
    metadata: Text;
    live_chat_poll_type: string;
    context_menu_button: Button | null;
    constructor(data: RawNode);
}
