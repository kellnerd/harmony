import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import AccessibilityData from './misc/AccessibilityData.js';
class SortFilterSubMenu extends YTNode {
    constructor(data) {
        super();
        if ('title' in data) {
            this.title = data.title;
        }
        if ('icon' in data) {
            this.icon_type = data.icon.iconType;
        }
        if ('tooltip' in data) {
            this.tooltip = data.tooltip;
        }
        if ('subMenuItems' in data) {
            this.sub_menu_items = data.subMenuItems.map((item) => ({
                title: item.title,
                selected: item.selected,
                continuation: item.continuation?.reloadContinuationData?.continuation,
                endpoint: new NavigationEndpoint(item.serviceEndpoint || item.navigationEndpoint),
                subtitle: item.subtitle || null
            }));
        }
        if ('accessibility' in data
            && 'accessibilityData' in data.accessibility) {
            this.accessibility = {
                accessibility_data: new AccessibilityData(data.accessibility.accessibilityData)
            };
        }
    }
    get label() {
        return this.accessibility?.accessibility_data?.label;
    }
}
SortFilterSubMenu.type = 'SortFilterSubMenu';
export default SortFilterSubMenu;
//# sourceMappingURL=SortFilterSubMenu.js.map