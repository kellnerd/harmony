import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import BadgeView from './BadgeView.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class ShortsLockupView extends YTNode {
    constructor(data) {
        super();
        this.entity_id = data.entityId;
        this.accessibility_text = data.accessibilityText;
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.on_tap_endpoint = new NavigationEndpoint(data.onTap);
        this.menu_on_tap = new NavigationEndpoint(data.menuOnTap);
        this.index_in_collection = data.indexInCollection;
        this.menu_on_tap_a11y_label = data.menuOnTapA11yLabel;
        this.overlay_metadata = {
            primary_text: data.overlayMetadata.primaryText ? Text.fromAttributed(data.overlayMetadata.primaryText) : undefined,
            secondary_text: data.overlayMetadata.secondaryText ? Text.fromAttributed(data.overlayMetadata.secondaryText) : undefined
        };
        if (data.inlinePlayerData?.onVisible) {
            this.inline_player_data = new NavigationEndpoint(data.inlinePlayerData.onVisible);
        }
        if (data.badge) {
            this.badge = Parser.parseItem(data.badge, BadgeView);
        }
    }
}
ShortsLockupView.type = 'ShortsLockupView';
export default ShortsLockupView;
//# sourceMappingURL=ShortsLockupView.js.map