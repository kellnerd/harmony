import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class ExpandableTab extends YTNode {
    constructor(data) {
        super();
        this.title = data.title;
        this.endpoint = new NavigationEndpoint(data.endpoint);
        this.selected = data.selected;
        this.content = Parser.parseItem(data.content);
    }
}
ExpandableTab.type = 'ExpandableTab';
export default ExpandableTab;
//# sourceMappingURL=ExpandableTab.js.map