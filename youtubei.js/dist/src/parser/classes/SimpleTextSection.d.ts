import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class SimpleTextSection extends YTNode {
    static type: string;
    lines: Text[];
    style: string;
    constructor(data: RawNode);
}
