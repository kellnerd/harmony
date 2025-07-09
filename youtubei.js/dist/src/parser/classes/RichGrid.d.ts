import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class RichGrid extends YTNode {
    static type: string;
    header: YTNode;
    contents: ObservedArray<YTNode>;
    target_id?: string;
    constructor(data: RawNode);
}
