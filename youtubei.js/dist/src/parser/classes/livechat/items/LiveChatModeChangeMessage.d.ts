import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import Text from '../../misc/Text.js';
export default class LiveChatModeChangeMessage extends YTNode {
    static type: string;
    id: string;
    icon_type: string;
    text: Text;
    subtext: Text;
    timestamp: number;
    timestamp_usec: string;
    timestamp_text: Text;
    constructor(data: RawNode);
}
