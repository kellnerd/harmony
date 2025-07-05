import { Parser } from '../../index.js';
import { YTNode } from '../../helpers.js';
import Button from '../Button.js';
import ButtonView from '../ButtonView.js';
import SegmentedLikeDislikeButtonView from '../SegmentedLikeDislikeButtonView.js';
import MenuFlexibleItem from './MenuFlexibleItem.js';
import LikeButton from '../LikeButton.js';
import ToggleButton from '../ToggleButton.js';
import FlexibleActionsView from '../FlexibleActionsView.js';
import AccessibilityData from '../misc/AccessibilityData.js';
class Menu extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parseArray(data.items);
        this.flexible_items = Parser.parseArray(data.flexibleItems, MenuFlexibleItem);
        this.top_level_buttons = Parser.parseArray(data.topLevelButtons, [ToggleButton, LikeButton, Button, ButtonView, SegmentedLikeDislikeButtonView, FlexibleActionsView]);
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
    // XXX: alias for consistency
    get contents() {
        return this.items;
    }
}
Menu.type = 'Menu';
export default Menu;
//# sourceMappingURL=Menu.js.map