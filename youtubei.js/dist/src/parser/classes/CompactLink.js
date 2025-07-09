import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
class CompactLink extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title).toString();
        if ('subtitle' in data)
            this.subtitle = new Text(data.subtitle);
        if ('icon' in data && 'iconType' in data.icon)
            this.icon_type = data.icon.iconType;
        if ('secondaryIcon' in data && 'iconType' in data.secondaryIcon)
            this.secondary_icon_type = data.secondaryIcon.iconType;
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint);
        this.style = data.style;
    }
}
CompactLink.type = 'CompactLink';
export default CompactLink;
//# sourceMappingURL=CompactLink.js.map