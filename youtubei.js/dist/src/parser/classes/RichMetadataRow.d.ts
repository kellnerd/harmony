import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class RichMetadataRow extends YTNode {
    static type: string;
    contents: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
