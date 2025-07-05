import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class WatchCardSectionSequence extends YTNode {
    static type: string;
    lists: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
