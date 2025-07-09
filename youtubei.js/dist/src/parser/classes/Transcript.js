import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import TranscriptSearchPanel from './TranscriptSearchPanel.js';
class Transcript extends YTNode {
    constructor(data) {
        super();
        this.content = Parser.parseItem(data.content, TranscriptSearchPanel);
    }
}
Transcript.type = 'Transcript';
export default Transcript;
//# sourceMappingURL=Transcript.js.map