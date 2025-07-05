import { YTNode } from '../helpers.js';
import AccessibilityData from './misc/AccessibilityData.js';
class MusicInlineBadge extends YTNode {
    constructor(data) {
        super();
        this.icon_type = data.icon.iconType;
        if ('accessibilityData' in data
            && 'accessibilityData' in data.accessibilityData) {
            this.accessibility = {
                accessibility_data: new AccessibilityData(data.accessibilityData.accessibilityData)
            };
        }
    }
    get label() {
        return this.accessibility?.accessibility_data?.label;
    }
}
MusicInlineBadge.type = 'MusicInlineBadge';
export default MusicInlineBadge;
//# sourceMappingURL=MusicInlineBadge.js.map