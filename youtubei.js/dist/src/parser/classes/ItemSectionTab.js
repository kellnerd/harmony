import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class ItemSectionTab extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.selected = !!data.selected;
        this.endpoint = new NavigationEndpoint(data.endpoint);
    }
}
ItemSectionTab.type = 'Tab';
export default ItemSectionTab;
//# sourceMappingURL=ItemSectionTab.js.map