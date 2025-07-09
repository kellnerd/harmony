import { type ObservedArray, YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class SectionList extends YTNode {
    static type: string;
    contents: ObservedArray<YTNode>;
    target_id?: string;
    continuation?: string;
    header?: YTNode;
    sub_menu?: YTNode;
    constructor(data: RawNode);
}
