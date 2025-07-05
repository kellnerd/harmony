import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class TranscriptSectionHeader extends YTNode {
    constructor(data) {
        super();
        this.start_ms = data.startMs;
        this.end_ms = data.endMs;
        this.snippet = new Text(data.snippet);
    }
}
TranscriptSectionHeader.type = 'TranscriptSectionHeader';
export default TranscriptSectionHeader;
//# sourceMappingURL=TranscriptSectionHeader.js.map