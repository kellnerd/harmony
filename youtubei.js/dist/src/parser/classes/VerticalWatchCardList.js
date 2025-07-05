import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class VerticalWatchCardList extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parseArray(data.items);
        this.view_all_text = new Text(data.viewAllText);
        this.view_all_endpoint = new NavigationEndpoint(data.viewAllEndpoint);
    }
    // XXX: Alias for consistency.
    get contents() {
        return this.items;
    }
}
VerticalWatchCardList.type = 'VerticalWatchCardList';
export default VerticalWatchCardList;
//# sourceMappingURL=VerticalWatchCardList.js.map