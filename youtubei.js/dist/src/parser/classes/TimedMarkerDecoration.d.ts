import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class TimedMarkerDecoration extends YTNode {
    static type: string;
    visible_time_range_start_millis: number;
    visible_time_range_end_millis: number;
    decoration_time_millis: number;
    label: Text;
    icon: string;
    constructor(data: RawNode);
}
