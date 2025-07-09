import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import LikeButtonView from './LikeButtonView.js';
import DislikeButtonView from './DislikeButtonView.js';
class SegmentedLikeDislikeButtonView extends YTNode {
    constructor(data) {
        super();
        this.like_button = Parser.parseItem(data.likeButtonViewModel, LikeButtonView);
        this.dislike_button = Parser.parseItem(data.dislikeButtonViewModel, DislikeButtonView);
        this.icon_type = data.iconType;
        if (this.like_button && this.like_button.toggle_button) {
            const toggle_button = this.like_button.toggle_button;
            if (toggle_button.default_button) {
                this.short_like_count = toggle_button.default_button.title;
                if (toggle_button.default_button.accessibility_text)
                    this.like_count = parseInt(toggle_button.default_button.accessibility_text.replace(/\D/g, ''));
            }
            else if (toggle_button.toggled_button) {
                this.short_like_count = toggle_button.toggled_button.title;
                if (toggle_button.toggled_button.accessibility_text)
                    this.like_count = parseInt(toggle_button.toggled_button.accessibility_text.replace(/\D/g, ''));
            }
        }
        this.like_count_entity = {
            key: data.likeCountEntity.key
        };
        this.dynamic_like_count_update_data = {
            update_status_key: data.dynamicLikeCountUpdateData.updateStatusKey,
            placeholder_like_count_values_key: data.dynamicLikeCountUpdateData.placeholderLikeCountValuesKey,
            update_delay_loop_id: data.dynamicLikeCountUpdateData.updateDelayLoopId,
            update_delay_sec: data.dynamicLikeCountUpdateData.updateDelaySec
        };
    }
}
SegmentedLikeDislikeButtonView.type = 'SegmentedLikeDislikeButtonView';
export default SegmentedLikeDislikeButtonView;
//# sourceMappingURL=SegmentedLikeDislikeButtonView.js.map