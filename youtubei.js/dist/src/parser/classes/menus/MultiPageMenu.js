import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class MultiPageMenu extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header);
        this.sections = Parser.parseArray(data.sections);
        this.style = data.style;
    }
}
MultiPageMenu.type = 'MultiPageMenu';
export default MultiPageMenu;
//# sourceMappingURL=MultiPageMenu.js.map