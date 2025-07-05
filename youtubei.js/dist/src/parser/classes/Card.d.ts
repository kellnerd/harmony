import { type RawNode } from '../index.js';
import { YTNode } from '../helpers.js';
export default class Card extends YTNode {
    static type: string;
    teaser: YTNode;
    content: YTNode;
    card_id?: string;
    feature?: string;
    cue_ranges: {
        start_card_active_ms: string;
        end_card_active_ms: string;
        teaser_duration_ms: string;
        icon_after_teaser_ms: string;
    }[];
    constructor(data: RawNode);
}
