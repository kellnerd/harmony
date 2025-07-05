import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import Button from '../../Button.js';
import Text from '../../misc/Text.js';
import Thumbnail from '../../misc/Thumbnail.js';
export default class LiveChatBannerPoll extends YTNode {
    static type: string;
    poll_question: Text;
    author_photo: Thumbnail[];
    choices: {
        option_id: string;
        text: string;
    }[];
    collapsed_state_entity_key: string;
    live_chat_poll_state_entity_key: string;
    context_menu_button: Button | null;
    constructor(data: RawNode);
}
