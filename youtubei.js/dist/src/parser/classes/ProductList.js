import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class ProductList extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.contents);
    }
}
ProductList.type = 'ProductList';
export default ProductList;
//# sourceMappingURL=ProductList.js.map