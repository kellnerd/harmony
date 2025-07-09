import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
export default class PlaylistSidebarSecondaryInfo extends YTNode {
    static type: string;
    owner: YTNode;
    button: YTNode;
    constructor(data: RawNode);
}
