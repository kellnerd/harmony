import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text } from '../misc.js';
export default class DialogHeaderView extends YTNode {
    static type: string;
    headline: Text;
    constructor(data: RawNode);
}
