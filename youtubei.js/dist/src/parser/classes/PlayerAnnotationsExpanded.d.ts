import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class PlayerAnnotationsExpanded extends YTNode {
    static type: string;
    featured_channel?: {
        start_time_ms: number;
        end_time_ms: number;
        watermark: Thumbnail[];
        channel_name: string;
        endpoint: NavigationEndpoint;
        subscribe_button: YTNode | null;
    };
    allow_swipe_dismiss: boolean;
    annotation_id: string;
    constructor(data: RawNode);
}
