import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../types/index.js';
export default class SendFeedbackAction extends YTNode {
    static type: string;
    bucket: string;
    constructor(data: RawNode);
}
