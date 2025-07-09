import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class ChannelVideoPlayer extends YTNode {
    static type: string;
    id: string;
    title: Text;
    description: Text;
    view_count: Text;
    published_time: Text;
    constructor(data: RawNode);
}
