import { type RawNode } from '../index.js';
import { type ObservedArray, YTNode } from '../helpers.js';
export default class PlaylistVideoList extends YTNode {
    static type: string;
    id: string;
    is_editable: boolean;
    can_reorder: boolean;
    videos: ObservedArray<YTNode>;
    constructor(data: RawNode);
}
