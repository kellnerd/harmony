import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
import type { RawNode } from '../index.js';
export default class MenuTitle extends YTNode {
    static type: string;
    title: Text;
    constructor(data: RawNode);
}
