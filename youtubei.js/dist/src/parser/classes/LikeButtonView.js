import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ToggleButtonView from './ToggleButtonView.js';
class LikeButtonView extends YTNode {
    constructor(data) {
        super();
        this.toggle_button = Parser.parseItem(data.toggleButtonViewModel, ToggleButtonView);
        this.like_status_entity_key = data.likeStatusEntityKey;
        this.like_status_entity = {
            key: data.likeStatusEntity.key,
            like_status: data.likeStatusEntity.likeStatus
        };
    }
}
LikeButtonView.type = 'LikeButtonView';
export default LikeButtonView;
//# sourceMappingURL=LikeButtonView.js.map