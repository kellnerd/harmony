import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Author from './misc/Author.js';
import Text from './misc/Text.js';
class WatchCardRichHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.title_endpoint = new NavigationEndpoint(data.titleNavigationEndpoint);
        this.subtitle = new Text(data.subtitle);
        this.author = new Author(data, data.titleBadge ? [data.titleBadge] : null, data.avatar);
        this.author.name = this.title.toString();
        this.style = data.style;
    }
}
WatchCardRichHeader.type = 'WatchCardRichHeader';
export default WatchCardRichHeader;
//# sourceMappingURL=WatchCardRichHeader.js.map