import { type SuperParsedResult, YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class LiveChatActionPanel extends YTNode {
    static type: string;
    id: string;
    contents: SuperParsedResult<YTNode>;
    target_id: string;
    constructor(data: RawNode);
}
