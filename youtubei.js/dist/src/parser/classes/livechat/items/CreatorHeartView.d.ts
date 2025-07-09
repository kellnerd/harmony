import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import Thumbnail from '../../misc/Thumbnail.js';
export default class CreatorHeartView extends YTNode {
    static type: string;
    creator_thumbnail: Thumbnail[];
    hearted_icon_name: string;
    unhearted_icon_name: string;
    unhearted_icon_processor: {
        border_image_processor: {
            image_tint: {
                color: number;
            };
        };
    };
    hearted_hover_text: string;
    hearted_accessibility_label: string;
    unhearted_accessibility_label: string;
    engagement_state_key: string;
    constructor(data: RawNode);
}
