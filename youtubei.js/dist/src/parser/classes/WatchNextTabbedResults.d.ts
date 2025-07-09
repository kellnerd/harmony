import type { RawNode } from '../index.js';
import TwoColumnBrowseResults from './TwoColumnBrowseResults.js';
export default class WatchNextTabbedResults extends TwoColumnBrowseResults {
    static type: string;
    constructor(data: RawNode);
}
