import type { ObservedArray } from '../../helpers.js';
import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class MultiPageMenuSection extends YTNode {
    static type: string;
    items: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
