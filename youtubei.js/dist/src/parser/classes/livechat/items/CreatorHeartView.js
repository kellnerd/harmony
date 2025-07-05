import { YTNode } from '../../../helpers.js';
import Thumbnail from '../../misc/Thumbnail.js';
class CreatorHeartView extends YTNode {
    constructor(data) {
        super();
        this.creator_thumbnail = Thumbnail.fromResponse(data.creatorThumbnail);
        this.hearted_icon_name = data.heartedIcon.sources[0].clientResource.imageName;
        this.unhearted_icon_name = data.unheartedIcon.sources[0].clientResource.imageName;
        this.unhearted_icon_processor = {
            border_image_processor: {
                image_tint: {
                    color: data.unheartedIcon.processor.borderImageProcessor.imageTint.color
                }
            }
        };
        this.hearted_hover_text = data.heartedHoverText;
        this.hearted_accessibility_label = data.heartedAccessibilityLabel;
        this.unhearted_accessibility_label = data.unheartedAccessibilityLabel;
        this.engagement_state_key = data.engagementStateKey;
    }
}
CreatorHeartView.type = 'CreatorHeartView';
export default CreatorHeartView;
//# sourceMappingURL=CreatorHeartView.js.map