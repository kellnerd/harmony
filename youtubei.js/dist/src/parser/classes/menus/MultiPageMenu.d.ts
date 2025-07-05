import type { ObservedArray } from '../../helpers.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class MultiPageMenu extends YTNode {
    static type: string;
    header: YTNode;
    sections: ObservedArray<YTNode>;
    style: string;
    constructor(data: RawNode);
}
