import type { ObservedArray } from '../helpers.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import { Text } from '../misc.js';
import TranscriptSectionHeader from './TranscriptSectionHeader.js';
import TranscriptSegment from './TranscriptSegment.js';
export default class TranscriptSegmentList extends YTNode {
    static type: string;
    initial_segments: ObservedArray<TranscriptSegment | TranscriptSectionHeader>;
    no_result_label: Text;
    retry_label: Text;
    touch_captions_enabled: boolean;
    constructor(data: RawNode);
}
