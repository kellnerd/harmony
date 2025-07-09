import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class PivotBar extends YTNode {
    static type: string;
    items: import("../../helpers.js").ObservedArray<YTNode>;
    constructor(data: RawNode);
}
