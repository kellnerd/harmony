import { Text } from '../misc.js';
import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class PlayerOverlayVideoDetails extends YTNode {
    static type: string;
    title: Text;
    subtitle: Text;
    constructor(data: RawNode);
}
