import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { Text } from '../misc.js';
export default class TranscriptSegment extends YTNode {
    static type: string;
    start_ms: string;
    end_ms: string;
    snippet: Text;
    start_time_text: Text;
    target_id: string;
    constructor(data: RawNode);
}
