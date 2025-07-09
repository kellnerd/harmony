import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import { Text } from '../misc.js';
export default class PremiereTrailerBadge extends YTNode {
    static type: string;
    label: Text;
    constructor(data: RawNode);
}
