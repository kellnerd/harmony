import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class UpdateDateTextAction extends YTNode {
    static type: string;
    date_text: string;
    constructor(data: RawNode);
}
