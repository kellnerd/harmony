import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import TranscriptFooter from './TranscriptFooter.js';
import TranscriptSearchBox from './TranscriptSearchBox.js';
import TranscriptSegmentList from './TranscriptSegmentList.js';
export default class TranscriptSearchPanel extends YTNode {
    static type: string;
    header: TranscriptSearchBox | null;
    body: TranscriptSegmentList | null;
    footer: TranscriptFooter | null;
    target_id: string;
    constructor(data: RawNode);
}
