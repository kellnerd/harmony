import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
export default class LikeButton extends YTNode {
    static type: string;
    target: {
        video_id: string;
    };
    like_status: string;
    likes_allowed: string;
    endpoints?: NavigationEndpoint[];
    constructor(data: RawNode);
}
