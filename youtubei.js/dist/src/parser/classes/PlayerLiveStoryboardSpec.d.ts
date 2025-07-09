import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export interface LiveStoryboardData {
    type: 'live';
    template_url: string;
    thumbnail_width: number;
    thumbnail_height: number;
    columns: number;
    rows: number;
}
export default class PlayerLiveStoryboardSpec extends YTNode {
    static type: string;
    board: LiveStoryboardData;
    constructor(data: RawNode);
}
