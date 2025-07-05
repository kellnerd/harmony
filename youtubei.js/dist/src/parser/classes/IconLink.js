import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class IconLink extends YTNode {
    constructor(data) {
        super();
        this.icon_type = data.icon?.iconType;
        if (Reflect.has(data, 'tooltip')) {
            this.tooltip = new Text(data.tooltip).toString();
        }
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
    }
}
IconLink.type = 'IconLink';
export default IconLink;
//# sourceMappingURL=IconLink.js.map