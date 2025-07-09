import { YTNode } from '../../../helpers.js';
import Text from '../../misc/Text.js';
import type { RawNode } from '../../../index.js';
export default class LiveChatRestrictedParticipation extends YTNode {
    static type: string;
    message: Text;
    icon_type?: string;
    constructor(data: RawNode);
}
