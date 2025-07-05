import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class Message extends YTNode {
    static type: string;
    text: Text;
    constructor(data: RawNode);
}
