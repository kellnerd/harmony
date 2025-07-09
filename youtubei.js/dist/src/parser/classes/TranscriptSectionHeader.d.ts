import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import Text from './misc/Text.js';
export default class TranscriptSectionHeader extends YTNode {
    static type: string;
    start_ms: string;
    end_ms: string;
    snippet: Text;
    constructor(data: RawNode);
}
