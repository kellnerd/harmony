import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class ProductListHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.suppress_padding_disclaimer = !!data.suppressPaddingDisclaimer;
    }
}
ProductListHeader.type = 'ProductListHeader';
export default ProductListHeader;
//# sourceMappingURL=ProductListHeader.js.map