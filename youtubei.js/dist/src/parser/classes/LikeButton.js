import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class LikeButton extends YTNode {
    constructor(data) {
        super();
        this.target = {
            video_id: data.target.videoId
        };
        this.like_status = data.likeStatus;
        this.likes_allowed = data.likesAllowed;
        if (Reflect.has(data, 'serviceEndpoints')) {
            this.endpoints = data.serviceEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
        }
    }
}
LikeButton.type = 'LikeButton';
export default LikeButton;
//# sourceMappingURL=LikeButton.js.map