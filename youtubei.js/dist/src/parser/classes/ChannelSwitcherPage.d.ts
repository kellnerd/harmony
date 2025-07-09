import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class ChannelSwitcherPage extends YTNode {
    static type: string;
    header: YTNode;
    contents: ObservedArray<YTNode> | null;
    constructor(data: RawNode);
}
