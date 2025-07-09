import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class TextHeader extends YTNode {
    static type: string;
    title: Text;
    style: string;
    constructor(data: RawNode);
}
