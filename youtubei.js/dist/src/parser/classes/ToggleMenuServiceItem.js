import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
class ToggleMenuServiceItem extends YTNode {
    constructor(data) {
        super();
        this.text = new Text(data.defaultText);
        this.toggled_text = new Text(data.toggledText);
        this.icon_type = data.defaultIcon.iconType;
        this.toggled_icon_type = data.toggledIcon.iconType;
        this.default_endpoint = new NavigationEndpoint(data.defaultServiceEndpoint);
        this.toggled_endpoint = new NavigationEndpoint(data.toggledServiceEndpoint);
    }
}
ToggleMenuServiceItem.type = 'ToggleMenuServiceItem';
export default ToggleMenuServiceItem;
//# sourceMappingURL=ToggleMenuServiceItem.js.map