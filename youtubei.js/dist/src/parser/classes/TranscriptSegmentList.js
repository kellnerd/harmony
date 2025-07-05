import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { Text } from '../misc.js';
import TranscriptSectionHeader from './TranscriptSectionHeader.js';
import TranscriptSegment from './TranscriptSegment.js';
class TranscriptSegmentList extends YTNode {
    constructor(data) {
        super();
        this.initial_segments = Parser.parseArray(data.initialSegments, [TranscriptSegment, TranscriptSectionHeader]);
        this.no_result_label = new Text(data.noResultLabel);
        this.retry_label = new Text(data.retryLabel);
        this.touch_captions_enabled = data.touchCaptionsEnabled;
    }
}
TranscriptSegmentList.type = 'TranscriptSegmentList';
export default TranscriptSegmentList;
//# sourceMappingURL=TranscriptSegmentList.js.map