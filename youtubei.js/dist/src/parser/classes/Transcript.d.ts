import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import TranscriptSearchPanel from './TranscriptSearchPanel.js';
export default class Transcript extends YTNode {
    static type: string;
    content: TranscriptSearchPanel | null;
    constructor(data: RawNode);
}
