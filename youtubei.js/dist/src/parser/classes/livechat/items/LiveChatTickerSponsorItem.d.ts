import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import Author from '../../misc/Author.js';
import Text from '../../misc/Text.js';
export default class LiveChatTickerSponsorItem extends YTNode {
    static type: string;
    id: string;
    detail: Text;
    author: Author;
    duration_sec: string;
    constructor(data: RawNode);
}
