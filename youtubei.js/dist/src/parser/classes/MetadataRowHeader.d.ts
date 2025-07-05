import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class MetadataRowHeader extends YTNode {
    static type: string;
    content: Text;
    has_divider_line: boolean;
    constructor(data: RawNode);
}
