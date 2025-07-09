import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MetadataRow extends YTNode {
    static type: string;
    title: Text;
    contents: Text[];
    constructor(data: RawNode);
}
