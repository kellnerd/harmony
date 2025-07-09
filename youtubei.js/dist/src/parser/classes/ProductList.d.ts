import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ProductList extends YTNode {
    static type: string;
    contents: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
