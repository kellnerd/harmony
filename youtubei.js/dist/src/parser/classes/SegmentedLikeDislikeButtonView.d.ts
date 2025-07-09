import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import LikeButtonView from './LikeButtonView.js';
import DislikeButtonView from './DislikeButtonView.js';
export default class SegmentedLikeDislikeButtonView extends YTNode {
    static type: string;
    like_button: LikeButtonView | null;
    dislike_button: DislikeButtonView | null;
    icon_type: string;
    like_count_entity: {
        key: string;
    };
    dynamic_like_count_update_data: {
        update_status_key: string;
        placeholder_like_count_values_key: string;
        update_delay_loop_id: string;
        update_delay_sec: number;
    };
    like_count?: number;
    short_like_count?: string;
    constructor(data: RawNode);
}
