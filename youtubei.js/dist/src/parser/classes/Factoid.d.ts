import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text } from '../misc.js';
export default class Factoid extends YTNode {
    static type: string;
    label: Text;
    value: Text;
    accessibility_text: string;
    constructor(data: RawNode);
}
