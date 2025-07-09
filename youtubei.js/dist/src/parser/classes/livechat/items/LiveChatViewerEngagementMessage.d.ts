import type { RawNode } from '../../../index.js';
import { YTNode } from '../../../helpers.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Text from '../../misc/Text.js';
export default class LiveChatViewerEngagementMessage extends YTNode {
    static type: string;
    id: string;
    timestamp?: number;
    timestamp_usec?: string;
    icon_type?: string;
    message: Text;
    action_button: YTNode | null;
    menu_endpoint?: NavigationEndpoint;
    context_menu_accessibility_label?: string;
    constructor(data: RawNode);
}
