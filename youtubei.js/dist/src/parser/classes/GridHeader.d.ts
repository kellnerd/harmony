import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class GridHeader extends YTNode {
    static type: string;
    title: Text;
    constructor(data: RawNode);
}
