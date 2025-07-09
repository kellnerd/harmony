import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class MetadataScreen extends YTNode {
    static type: string;
    section_list: YTNode;
    constructor(data: RawNode);
}
