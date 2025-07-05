import { YTNode } from '../helpers.js';
import type { RawNode } from '../types/index.js';
export default class ClipCreationScrubber extends YTNode {
    static type: string;
    length_template: string;
    max_length_ms: number;
    min_length_ms: number;
    default_length_ms: number;
    window_size_ms: number;
    start_label?: string;
    end_label?: string;
    duration_label?: string;
    constructor(data: RawNode);
}
