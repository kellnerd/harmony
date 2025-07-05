import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import { Text, Thumbnail } from '../misc.js';
import Button from './Button.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class ProductListItem extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.accessibility_title = data.accessibilityTitle;
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
        this.price = data.price;
        this.endpoint = new NavigationEndpoint(data.onClickCommand);
        this.merchant_name = data.merchantName;
        this.stay_in_app = !!data.stayInApp;
        this.view_button = Parser.parseItem(data.viewButton, Button);
    }
}
ProductListItem.type = 'ProductListItem';
export default ProductListItem;
//# sourceMappingURL=ProductListItem.js.map