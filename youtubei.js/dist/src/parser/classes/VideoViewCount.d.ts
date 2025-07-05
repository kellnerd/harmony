import { Text } from '../misc.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class VideoViewCount extends YTNode {
    static type: string;
    original_view_count: string;
    short_view_count: Text;
    extra_short_view_count: Text;
    view_count: Text;
    constructor(data: RawNode);
}
