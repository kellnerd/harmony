import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class TranscriptSegment extends YTNode {
    constructor(data) {
        super();
        this.start_ms = data.startMs;
        this.end_ms = data.endMs;
        this.snippet = new Text(data.snippet);
        this.start_time_text = new Text(data.startTimeText);
        this.target_id = data.targetId;
    }
}
TranscriptSegment.type = 'TranscriptSegment';
export default TranscriptSegment;
//# sourceMappingURL=TranscriptSegment.js.map