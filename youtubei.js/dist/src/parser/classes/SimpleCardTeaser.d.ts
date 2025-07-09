import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class SimpleCardTeaser extends YTNode {
    static type: string;
    message: Text;
    prominent: boolean;
    constructor(data: RawNode);
}
