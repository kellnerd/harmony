import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import AccessibilityData from './misc/AccessibilityData.js';
class MusicPlayButton extends YTNode {
    constructor(data) {
        super();
        this.endpoint = new NavigationEndpoint(data.playNavigationEndpoint);
        this.play_icon_type = data.playIcon.iconType;
        this.pause_icon_type = data.pauseIcon.iconType;
        if ('accessibilityPlayData' in data
            && 'accessibilityData' in data.accessibilityPlayData) {
            this.accessibility_play_data = {
                accessibility_data: new AccessibilityData(data.accessibilityPlayData.accessibilityData)
            };
        }
        if ('accessibilityPauseData' in data
            && 'accessibilityData' in data.accessibilityPauseData) {
            this.accessibility_pause_data = {
                accessibility_data: new AccessibilityData(data.accessibilityPauseData.accessibilityData)
            };
        }
        this.icon_color = data.iconColor;
    }
    get play_label() {
        return this.accessibility_play_data?.accessibility_data?.label;
    }
    get pause_label() {
        return this.accessibility_pause_data?.accessibility_data?.label;
    }
}
MusicPlayButton.type = 'MusicPlayButton';
export default MusicPlayButton;
//# sourceMappingURL=MusicPlayButton.js.map