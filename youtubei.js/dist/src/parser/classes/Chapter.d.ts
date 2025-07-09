import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class Chapter extends YTNode {
    static type: string;
    title: Text;
    time_range_start_millis: number;
    thumbnail: Thumbnail[];
    constructor(data: RawNode);
}
