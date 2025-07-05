import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import Button from '../../Button.js';
import Text from '../../misc/Text.js';
import Thumbnail from '../../misc/Thumbnail.js';
export default class LiveChatBannerRedirect extends YTNode {
    static type: string;
    banner_message: Text;
    author_photo: Thumbnail[];
    inline_action_button: Button | null;
    context_menu_button: Button | null;
    constructor(data: RawNode);
}
