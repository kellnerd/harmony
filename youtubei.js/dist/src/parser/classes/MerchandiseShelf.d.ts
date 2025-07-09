import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class MerchandiseShelf extends YTNode {
    static type: string;
    title: string;
    menu: YTNode;
    items: ObservedArray<YTNode>;
    constructor(data: RawNode);
    get contents(): ObservedArray<YTNode>;
}
