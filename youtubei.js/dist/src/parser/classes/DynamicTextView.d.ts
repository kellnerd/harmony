import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class DynamicTextView extends YTNode {
    static type: string;
    text: Text;
    max_lines: number;
    constructor(data: RawNode);
}
