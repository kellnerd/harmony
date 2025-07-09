import { YTNode, type ObservedArray } from '../helpers.js';
import { type RawNode } from '../index.js';
import Tab from './Tab.js';
export default class SingleColumnBrowseResults extends YTNode {
    static type: string;
    tabs: ObservedArray<Tab>;
    constructor(data: RawNode);
}
