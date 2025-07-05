import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class PivotBar extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parseArray(data.items);
    }
}
PivotBar.type = 'PivotBar';
export default PivotBar;
//# sourceMappingURL=PivotBar.js.map