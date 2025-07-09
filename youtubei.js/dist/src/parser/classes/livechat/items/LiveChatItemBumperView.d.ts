import { YTNode } from '../../../helpers.js';
import { type RawNode } from '../../../index.js';
import BumperUserEduContentView from './BumperUserEduContentView.js';
export default class LiveChatItemBumperView extends YTNode {
    static type: string;
    content: BumperUserEduContentView | null;
    constructor(data: RawNode);
}
