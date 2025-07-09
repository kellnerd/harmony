import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import Button from '../../Button.js';
import Text from '../../misc/Text.js';
export default class LiveChatBannerHeader extends YTNode {
    static type: string;
    text: Text;
    icon_type?: string;
    context_menu_button: Button | null;
    constructor(data: RawNode);
}
