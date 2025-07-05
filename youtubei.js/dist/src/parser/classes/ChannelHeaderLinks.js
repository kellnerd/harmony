import { YTNode, observe } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
// XXX (LuanRT): This is not a real YTNode, but we treat it as one to keep things clean.
export class HeaderLink extends YTNode {
    constructor(data) {
        super();
        this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.icon = Thumbnail.fromResponse(data.icon);
        this.title = new Text(data.title);
    }
}
HeaderLink.type = 'HeaderLink';
class ChannelHeaderLinks extends YTNode {
    constructor(data) {
        super();
        this.primary = observe(data.primaryLinks?.map((link) => new HeaderLink(link)) || []);
        this.secondary = observe(data.secondaryLinks?.map((link) => new HeaderLink(link)) || []);
    }
}
ChannelHeaderLinks.type = 'ChannelHeaderLinks';
export default ChannelHeaderLinks;
//# sourceMappingURL=ChannelHeaderLinks.js.map