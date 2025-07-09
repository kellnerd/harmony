import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class MultiPageMenuSection extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parseArray(data.items);
    }
}
MultiPageMenuSection.type = 'MultiPageMenuSection';
export default MultiPageMenuSection;
//# sourceMappingURL=MultiPageMenuSection.js.map