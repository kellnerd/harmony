import Button from '../../Button.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Text from '../../misc/Text.js';
import { YTNode, type ObservedArray } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
export default class LiveChatAutoModMessage extends YTNode {
    static type: string;
    menu_endpoint?: NavigationEndpoint;
    moderation_buttons: ObservedArray<Button>;
    auto_moderated_item: YTNode;
    header_text: Text;
    timestamp: number;
    id: string;
    constructor(data: RawNode);
}
